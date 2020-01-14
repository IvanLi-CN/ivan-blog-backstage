import {Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControlName, NgControl} from '@angular/forms';
import {BehaviorSubject, combineLatest, from, iif, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, distinct, filter, map, mergeScan, startWith, switchMap, take, takeUntil, tap, toArray} from 'rxjs/operators';
import {BaseEntityIdSelectorOption} from './base-entity-id-selector-option.interface';
import {Destroyable} from '../../core/destroyable';


export class BaseEntityIdSelectorComponent<ValueType = number>
  extends Destroyable
  implements OnInit, ControlValueAccessor, OnDestroy {

  readonly oldDataSubject = new ReplaySubject(1);
  readonly oldData$ = this.oldDataSubject.pipe();
  readonly ALL: BaseEntityIdSelectorOption = {value: null, label: '全部'};
  isDisabled = false;
  @Input()
  isShowTheAllOption = false;
  @Input()
  nzMode: 'default' | 'multiple' | 'tags' = 'default';
  readonly pageSize = 10;
  @Input()
  allowClear = true;
  public options: { label: string, value: string | number }[] = [];
  @Input()
  activatedIcon: string;
  @Input()
  notActivatedIcon: string;
  @Input()
  placeholder: string;
  // tslint:disable-next-line:no-input-rename
  @Input('value')
  val: ValueType | ValueType[];
  onChange = ((value: ValueType | ValueType[]) => {
  });
  nzFilterOption = (() => true);
  onTouched = (() => {
  });
  public loading = false;
  readonly pageIndexSubject = new BehaviorSubject<number>(0);
  protected readonly valueSubject = new Subject<ValueType | ValueType[]>();
  readonly value$: Observable<ValueType | ValueType[]> = this.valueSubject.pipe();
  protected readonly keywordSubject = new Subject<string>();
  readonly keyword$: Observable<string> = this.keywordSubject;
  private currSelectedOptionsSubject = new Subject<BaseEntityIdSelectorOption<ValueType>[]>();
  readonly options$: Observable<BaseEntityIdSelectorOption[]> = combineLatest<BaseEntityIdSelectorOption<ValueType>[]>([
    this.keyword$.pipe(
      debounceTime(200),
      map(keyword => keyword.trim()),
      tap(() => this.pageIndexSubject.next(1)),
      switchMap(keyword => this.pageIndexSubject.pipe(
        tap(() => this.loading = true),
        switchMap(pageIndex => this.fetchData(
          keyword,
          pageIndex,
          this.pageSize),
        ),
        switchMap(items => from(items)),
        distinct(item => item.value),
        mergeScan((acc, value1) => of([...acc, value1]), []),
        tap(() => this.loading = false),
      )),
      tap(options => {
        if (!this.allowClear) {
          this.val = options[0] ? this.serializedValue(options[0].value) : null;
        }
      }),
      switchMap(options => this.notOptionalIds$.pipe(
        map(ids => options.filter(option => option.value !== ids)),
      )),
    ),
    this.currSelectedOptionsSubject.pipe(
      startWith([]),
    ),
  ]).pipe(
    map(([a, b]) => [...a as any, ...b as any]),
    map(options => {
      console.log('isShowTheAllOption', this.isShowTheAllOption);
      if (this.isShowTheAllOption) {
        return [this.ALL, ...options];
      }
      return options;
    }),
    switchMap(options => from(options).pipe(
      filter(v => !!v),
      distinct(item => item.value),
      toArray(),
    )),
  );
  private localNotOptionalIds: ValueType[] = [];
  private readonly notOptionalIdsSubject = new BehaviorSubject<ValueType[]>([]);
  readonly notOptionalIds$: Observable<ValueType[]> = this.notOptionalIdsSubject;

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
  ) {
    super();
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    this.value$.pipe(
      switchMap(value => iif(
        () => this.nzMode === 'multiple',
        of(value).pipe(
          filter(v => Array.isArray(v)),
          switchMap((ids: ValueType[]) => from(ids).pipe(
            switchMap(id => this.fetchOldOne(id)),
            toArray(),
          )),
        ),
        this.fetchOldOne(value as ValueType).pipe(
          toArray(),
        ),
      )),
      takeUntil(this.destroyed$),
    ).subscribe(options => {
      this.currSelectedOptionsSubject.next(options);
    });
  }

  get notOptionalIds(): ValueType[] {
    return this.localNotOptionalIds;
  }

  @Input()
  set notOptionalIds(value: ValueType[]) {
    this.localNotOptionalIds = value;
    this.notOptionalIdsSubject.next(value);
  }

  get value() {
    return this.val;
  }

  set value(val: ValueType | ValueType[]) {
    if (val) {
      if (Array.isArray(val)) {
        this.val = val.map(v => this.serializedValue(v));
      } else {
        this.val = this.serializedValue(val);
      }
    } else {
      this.val = null;
      this.keywordSubject.next('');
    }
    this.valueSubject.next(this.value);

    this.onChange(val);
    this.onTouched();
  }

  fetchData(keyword: string, pageIndex: number, pageSize: number): Observable<BaseEntityIdSelectorOption<ValueType>[]> {
    return of([]);
  }

  ngOnInit() {
    setTimeout(() => {
      this.search();
    }, 1000);
  }

  fetchOldOne(value: ValueType): Observable<BaseEntityIdSelectorOption<ValueType>> {
    return of();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  onFocus($event: void) {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  search(value: string = ''): void {
    this.keywordSubject.next(value);
  }

  ngModelChange() {
  }

  fetchMore() {
    if (this.loading) {
      return;
    }
    this.pageIndexSubject.pipe(take(1)).subscribe(pageIndex => {
      this.pageIndexSubject.next(pageIndex++);
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  protected serializedValue(raw: any): ValueType {
    if (raw === undefined) {
      return undefined;
    }
    return +raw as unknown as ValueType;
  }
}
