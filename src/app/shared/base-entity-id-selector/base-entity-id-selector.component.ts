import {Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControlName, NgControl} from '@angular/forms';
import {BehaviorSubject, from, iif, merge, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {debounceTime, distinct, filter, map, mergeScan, switchMap, take, tap, toArray} from 'rxjs/operators';
import {BaseEntityIdSelectorOption} from './base-entity-id-selector-option.interface';


export class BaseEntityIdSelectorComponent implements OnInit, ControlValueAccessor {

  readonly oldDataSubject = new ReplaySubject(1);
  readonly oldData$ = this.oldDataSubject.pipe();
  get notOptionalIds(): number[] {
    return this.localNotOptionalIds;
  }

  @Input()
  set notOptionalIds(value: number[]) {
    this.localNotOptionalIds = value;
    this.notOptionalIdsSubject.next(value);
  }

  @Input()
  nzMode: 'default' | 'multiple' | 'tags' = 'default';

  private localNotOptionalIds: number[] = [];
  private readonly notOptionalIdsSubject = new BehaviorSubject<number[]>([]);
  readonly notOptionalIds$: Observable<number[]> = this.notOptionalIdsSubject;
  private readonly valueSubject = new Subject<number|number[]>();
  readonly value$: Observable<number|number[]> = this.valueSubject;
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
  val: number| number[];
  @Input()
  fetchData: (keyword: string, skip: number, take: number) => Observable<BaseEntityIdSelectorOption[]> = (() => {
    return of([]);
  });
  fetchOldOne: (value: number) => Observable<BaseEntityIdSelectorOption> = (() => {
    return of();
  });
  onChange = ((value: number|number[]) => {
  });
  nzFilterOption = (() => true);
  onTouched = (() => {
  });

  public loading = false;
  protected readonly keywordSubject = new Subject<string>();
  readonly keyword$: Observable<string> = this.keywordSubject;

  readonly options$: Observable<BaseEntityIdSelectorOption[]> = merge<BaseEntityIdSelectorOption[], BaseEntityIdSelectorOption[]>(
    this.keyword$.pipe(
      debounceTime(200),
      map(keyword => keyword.trim()),
      tap(() => this.skipSubject.next(0)),
      switchMap(keyword => this.skipSubject.pipe(
        tap(() => this.loading = true),
        switchMap(skip => this.fetchData(keyword, skip, this.pageSize)),
        switchMap(items => from(items)),
        distinct(item => item.value),
        mergeScan((acc, value1) => of([...acc, value1]), []),
        tap(() => this.loading = false),
      )),
      tap(options => {
        if (!this.allowClear) {
          this.val = options[0] ? +options[0].value : null;
        }
      }),
      switchMap(options => this.notOptionalIds$.pipe(
        map(ids => options.filter(option => option.value !== ids)),
      )),
    ),
    this.value$.pipe(
      switchMap(value => iif(
        () => this.nzMode === 'multiple',
        of(value).pipe(
          filter(v => Array.isArray(v)),
          switchMap((ids: number[]) => from(ids).pipe(
            switchMap(id => this.fetchOldOne(id)),
            toArray(),
          )),
        ),
        this.fetchOldOne(value as number).pipe(
          tap(console.log),
          toArray(),
        ),
      )),
      map(option => [option]),
    )
  );

  readonly skipSubject = new BehaviorSubject<number>(0);
  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  get value() {
    return this.val;
  }

  set value(val: number|number[]) {
    if (val) {
      if (Array.isArray(val)) {
        this.val = val.map(v => +v);
      } else {
        this.val = +val;
      }
    } else {
      this.val = null;
      this.keywordSubject.next('');
    }
    this.valueSubject.next(this.value);

    this.onChange(val);
    this.onTouched();
  }

  ngOnInit() {
    setTimeout(() => {
      this.search();
    }, 1000);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
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
    this.skipSubject.pipe(take(1)).subscribe(skip => {
      this.skipSubject.next(skip + this.pageSize);
    });
  }
}
