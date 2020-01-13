import {BehaviorSubject, combineLatest, concat, iif, merge, Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {catchError, filter, share, shareReplay, startWith, switchMap, take, takeUntil, tap, timeout} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {AppException} from './exceptions/app-exception';
import {EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import * as debug from 'debug';
import {fromPromise} from 'rxjs/internal-compatibility';

const log = debug('ivan:base:editor');

export class BaseEditorComponent<ItemType = any> implements OnInit, OnDestroy {
  public readonly dataForm = this.fb.group({});
  public isLoading = false;
  @Output()
  public needUpdateList = new EventEmitter();
  public readonly destroying$: Observable<void>;
  public readonly destroyed$: Observable<void>;
  isCreated$: Observable<boolean>;
  protected readonly oldDataSubject = new ReplaySubject<ItemType>(1);
  public readonly oldData$: Observable<ItemType> = this.oldDataSubject.pipe();
  protected defaultData: ItemType = {} as ItemType;
  @ViewChild('tplContent', {static: false})
  protected readonly tplContent;
  private localIsCreated = this.getDefaultIsCreated();
  private listItemSubject = new ReplaySubject<ItemType>(1);
  listItem$: Observable<ItemType> = this.listItemSubject;
  private readonly resetFormSubject = new Subject<void>();
  private readonly destroyingSubject = new Subject<void>();
  private readonly destroyedSubject = new Subject<void>();
  private localListItem: ItemType;
  private isCreatedSubject = new BehaviorSubject(this.localIsCreated);

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly message: NzMessageService,
    public readonly route: ActivatedRoute,
    public readonly router: Router,
  ) {
    this.destroyed$ = this.getDestroyed$();
    this.destroying$ = this.getDestroying$();
    this.isCreated$ = this.getIsCreated$();
    this.oldData$.pipe(
      filter(value => !!value),
    ).subscribe(value => {
      this.dataForm.patchValue(value);
    });
  }

  get listItem(): ItemType {
    return this.localListItem;
  }

  @Input()
  set listItem(value: ItemType) {
    this.localListItem = value;
    this.listItemSubject.next(this.listItem);
  }

  get isCreated(): boolean {
    return this.localIsCreated;
  }

  @Input()
  set isCreated(value: boolean) {
    this.localIsCreated = value;
    this.isCreatedSubject.next(this.isCreated);
  }

  public async submitForm($event) {
    $event.preventDefault();
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    try {
      for (const key of Object.keys(this.dataForm.controls)) {
        this.dataForm.controls[key].markAsDirty();
        this.dataForm.controls[key].markAsTouched();
        this.dataForm.controls[key].updateValueAndValidity();
      }
      this.dataForm.updateValueAndValidity();
      if (this.dataForm.invalid) {
        console.warn(this.dataForm.value);
        for (const key in this.dataForm.controls) {
          if (this.dataForm.controls[key].invalid) {
            console.warn(this.dataForm.controls[key]);
          }
        }
        this.message.warning('提交的内容不合法，请修正后再次尝试！');
        return;
      }
      iif(
        () => this.localIsCreated,
        this.onSubmitCreated(this.getCreatedData()).pipe(tap(
          () => this.message.success('添加成功！'),
          (err) => {
            if (!err.message) {
              this.message.info('添加失败！');
            } else if (typeof err.message !== 'object') {
              this.message.info(`添加失败！原因：${err.message}`);
            }
          },
        )),
        this.onSubmitModify(this.getModifyData()).pipe(tap(
          () => this.message.success('修改成功！'),
          (err) => {
            if (!err.message) {
              this.message.info('修改失败！');
            } else if (typeof err.message !== 'object') {
              this.message.info(`修改失败！原因：${err.message}`);
            }
          },
        )),
      ).subscribe(value => {
          this.needUpdateList.emit();
          this.onSubmittedSuccessfully();
          this.resetForm();
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          if (error.body && error.body.code === 422) {
            Object.keys(error.body.msg).forEach(field => {
              try {
                if (this.dataForm.controls[field]) {
                  this.dataForm.controls[field].setErrors({server: error.body.msg[field].msg});
                }
              } catch (e) {
                console.warn(field, e);
              }
            });
          }
        }
      );
    } finally {
      this.isLoading = false;
    }
  }

  public async resetForm($event = null) {
    this.resetFormSubject.next();
  }

  public getDataId(item: ItemType) {
    return (item as any).id;
  }

  ngOnDestroy(): void {
    this.destroyedSubject.next();
  }

  ngOnInit(): void {
    this.init();
  }

  protected resetFormByData(data) {
    this.dataForm.reset(data);
    for (const key of Object.keys(this.dataForm.controls)) {
      this.dataForm.controls[key].markAsPristine();
      this.dataForm.controls[key].updateValueAndValidity();
    }
  }

  protected init() {
    this.watchDestroy();
    this.fetchDataWhenCreateMode();
    this.watch4ResetFrom();
  }

  protected fetchOldData(listItem?: ItemType): Observable<ItemType> {
    // tslint:disable-next-line:no-console
    return of({} as ItemType).pipe(tap(() => console.debug('发起查询', listItem)));
  }

  protected getCreatedData() {
    const tmp = this.getBaseData();
    delete tmp.id;
    return tmp;
  }

  protected getModifyData() {
    return this.getBaseData();
  }

  protected getBaseData() {
    return {...this.dataForm.value};
  }

  protected onSubmitCreated(data): Observable<ItemType> {
    return throwError(new AppException('onSubmitCreated'));
  }

  protected onSubmitModify(data): Observable<ItemType> {
    return throwError(new AppException('onSubmitModify'));
  }

  protected onSubmittedSuccessfully() {
    log('onSubmittedSuccessfully');
    return;
  }

  private watch4ResetFrom() {
    merge(
      this.resetFormSubject.pipe(
        switchMap(() => this.isCreated$.pipe(take(1))),
      ),
      this.isCreated$
    ).pipe(
      switchMap(isCreated =>
        iif(
          () => isCreated,
          of(this.defaultData),
          this.oldData$,
        ),
      ),
    ).subscribe(data4Reset => {
      log('reset form: %o', data4Reset);
      this.resetFormByData(data4Reset);
    });
  }

  private fetchDataWhenCreateMode() {
    combineLatest(
      this.isCreated$,
      this.listItem$.pipe(startWith(null)),
    ).pipe(
      switchMap(
        ([
           isCreated,
           listItem,
         ]) => iif(
          () => isCreated,
          concat(
            iif(() => !!listItem, of(this.listItem)), // backup
            this.fetchOldData(listItem),
          ),
        ),
      ),
    ).subscribe(oldData => {
      log('old data: %o', oldData);
      // @ts-ignore
      this.oldDataSubject.next(oldData);
    });
  }

  private getDestroying$() {
    return this.destroyingSubject.pipe(
      takeUntil(this.destroyed$),
      share(),
    );
  }

  private getDestroyed$() {
    return this.destroyedSubject.pipe(share());
  }

  private watchDestroy() {
    this.destroying$.pipe(
      takeUntil(this.destroyed$),
      switchMap(() => fromPromise(this.isAllowDestroy())),
      filter(value => value),
    ).subscribe(() => {
      this.destroyedSubject.next();
    });
  }

  private async isAllowDestroy(): Promise<boolean> {
    log('allow destroy');
    return true;
  }

  private getIsCreated$() {
    return this.isCreatedSubject.pipe(
      startWith(this.isCreated),
      shareReplay(1),
    );
  }

  protected getDefaultIsCreated() {
    return false;
  }
}
