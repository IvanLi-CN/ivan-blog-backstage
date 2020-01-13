import {BaseEditorComponent} from './base-editor.component';
import {BehaviorSubject, iif, Observable, of, ReplaySubject, throwError} from 'rxjs';
import {EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, filter, take, tap, timeout} from 'rxjs/operators';
import {AsyncTaskRequest} from './models/AsyncTaskRequest';
import {AppException} from './exceptions/app-exception';

export class BaseModelEditorComponent<ItemType = any>
  extends BaseEditorComponent<ItemType> {
  protected createdModalTitle = '新增';
  protected modifyModalTitle = '编辑';
  readonly dataForm = this.fb.group({});
  readonly oldDataSubject = new ReplaySubject<ItemType>(1);
  readonly oldData$: Observable<ItemType> = this.oldDataSubject.pipe();
  isLoading = false;
  @Output()
  needUpdateList = new EventEmitter();
  protected modalWidth = '500px';
  public modal: NzModalRef<unknown>;
  protected modalCloseable = false;
  protected defaultData: ItemType = {} as ItemType;
  @ViewChild('tplContent', { static: false })
  protected readonly tplContent;

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly message: NzMessageService,
    public readonly route: ActivatedRoute,
    public readonly router: Router,
    public modalService: NzModalService,
  ) {
    super(fb, message, route, router);
  }

  @Input()
  set isCreated(value: boolean) {
    this.localIsCreated = value;
    this.isCreatedSubject.next(this.isCreated);
  }

  private isCreatedSubject = new BehaviorSubject(this.localIsCreated);
  isCreated$: Observable<boolean> = this.isCreatedSubject;

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
          // tslint:disable-next-line:no-unused-expression
          this.modal && this.modal.destroy();
          this.resetForm();
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          if (error.body && error.body.code === 422) {
            Object.keys(error.body.msg).forEach(field => {
              try {
                if (this.dataForm.controls[field]) {
                  this.dataForm.controls[field].setErrors({ server: error.body.msg[field].msg });
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
    // tslint:disable-next-line:no-unused-expression
    $event && $event.preventDefault();
    this.dataForm.reset(
      await this.oldData$.pipe(
        take(1),
        filter(value => !!value),
        timeout(100),
        catchError(() => of(this.defaultData),
        )
      ).toPromise());
    for (const key of Object.keys(this.dataForm.controls)) {
      this.dataForm.controls[key].markAsPristine();
      this.dataForm.controls[key].updateValueAndValidity();
    }
    // tslint:disable-next-line:no-unused-expression
    this.modal && this.modal.destroy();
  }

  public getDataId(item: ItemType) {
    return (item as any).id;
  }

  public async openDialog(asyncTaskRequest: AsyncTaskRequest = null, tplContent = this.tplContent) {
    try {
      if (!this.localIsCreated) {
        const data = await this.fetchOldData(this._listItem).pipe(take(1)).toPromise();
        this.oldDataSubject.next(data);
      }
      this.modal = this.modalService.create({
        nzTitle: this.localIsCreated ? this.createdModalTitle : this.modifyModalTitle,
        nzContent: tplContent,
        nzFooter: null,
        nzMaskClosable: true,
        nzClosable: this.modalCloseable,
        nzWidth: this.modalWidth,
      });
      // tslint:disable-next-line:no-unused-expression
      asyncTaskRequest && asyncTaskRequest.controlSubject.next({ status: 'success' });
      // tslint:disable-next-line:no-unused-expression
      asyncTaskRequest && asyncTaskRequest.controlSubject.complete();
    } catch (e) {
      // tslint:disable-next-line:no-unused-expression
      asyncTaskRequest && asyncTaskRequest.controlSubject.next({ status: 'failed' });
      // tslint:disable-next-line:no-unused-expression
      asyncTaskRequest && asyncTaskRequest.controlSubject.error(e);
    }
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line:no-unused-expression
    this.modal && this.modal.destroy();
  }

  protected fetchOldData(listItem: ItemType): Observable<ItemType> {
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
    return { ...this.dataForm.value };
  }

  protected onSubmitCreated(data): Observable<ItemType> {
    return throwError(new AppException('onSubmitCreated'));
  }

  protected onSubmitModify(data): Observable<ItemType> {
    return throwError(new AppException('onSubmitModify'));
  }
}
