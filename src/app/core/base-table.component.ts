import {merge, Observable, of, ReplaySubject, Subject, throwError, timer} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzTableComponent, NzThFilterType} from 'ng-zorro-antd';
import {BaseListDto} from './models/base-list.dto';
import {catchError, debounceTime, filter, map, pluck, shareReplay, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BaseQueryDto} from './models/base-query.dto';
import {AsyncTaskRequest} from './models/AsyncTaskRequest';
import {AppException} from './exceptions/app-exception';
import {OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as debug from 'debug';
import {sanitize} from 'class-sanitizer';
import {Destroyable} from './destroyable';

const log = debug('ivan:base:table');

export class BaseTableComponent<QueryDtoType extends BaseQueryDto = BaseQueryDto,
  ItemType = any,
  ListType extends BaseListDto<ItemType> = BaseListDto<ItemType>,
  > extends Destroyable implements OnInit, OnDestroy {
  isCollapsed = true;
  @ViewChild('indexListTable', {static: true})
  table: NzTableComponent;
  public readonly filterForm = this.fb.group({});
  public readonly filters$: Observable<QueryDtoType>;
  public readonly listDtoSubject: Subject<ListType>;
  public readonly listDto$: Observable<ListType>;
  public readonly records$: Observable<ListType[]>;
  isLoading = false;
  records: any[] = [];
  totalCount = 0;
  checkedIdSet = new Set<any>();
  isIndeterminate = false;
  isAllChecked = false;
  numberOfChecked: number;
  conditions: QueryDtoType = null;
  optionsOfFilters: Partial<Record<keyof QueryDtoType, NzThFilterType>> = {};
  listOfSelection = [
    {
      text: '全选',
      onSelect: () => {
        this.checkAll(true);
      }
    },
    {
      text: '反选',
      onSelect: () => {
        this.records.forEach(item => {
          if (this.checkedIdSet.has(this.getItemId(item))) {
            this.checkedIdSet.delete(this.getItemId(item));
          } else {
            this.checkedIdSet.add(this.getItemId(item));
          }
          this.refreshStatus();
        });
      }
    },
    {
      text: '全不选',
      onSelect: () => {
        this.records.forEach(item => (this.checkedIdSet.delete(this.getItemId(item))));
        this.refreshStatus();
      }
    }
  ];
  sortMap = new Map<string, string>();
  protected readonly baseConditions: QueryDtoType = new BaseQueryDto() as QueryDtoType;
  protected readonly defaultConditions: QueryDtoType = this.baseConditions;
  protected readonly filtersSubject = new Subject<QueryDtoType>();
  private listResSubject = new Subject<any>();
  public readonly listRes$: Observable<any> = this.listResSubject.pipe();

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
  ) {
    super();
    this.listDtoSubject = this.getListDtoSubject();
    this.listDto$ = this.listDtoSubject;
    this.filters$ = this.getFilters$();
    this.records$ = this.getRecords$();
  }

  get tableRecords(): ItemType[] {
    return this.table.data;
  }

  get pageSize$(): Observable<number> {
    return this.filters$.pipe(pluck('pageSize'), startWith(10));
  }

  get pageIndex$(): Observable<number> {
    return this.filters$.pipe(
      pluck('pageIndex')
    );
  }

  get pageCount(): number {
    return Math.ceil(this.totalCount / this.baseConditions.pageSize);
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  public onSubmit($event = null) {
    // tslint:disable-next-line:no-unused-expression
    $event && $event.preventDefault();
    this.filterForm.updateValueAndValidity();
    this.mergeConditions2Filter(Object.assign({}, this.getFilterData(), {pageIndex: 1}));
  }

  public resetFilter($event = null) {
    // tslint:disable-next-line:no-unused-expression
    $event && $event.preventDefault();
    this.filterForm.reset(this.defaultConditions);
    const emptyConditions = {};
    for (const key of Object.keys(this.filterForm.controls)) {
      this.filterForm.controls[key].markAsPristine();
      this.filterForm.controls[key].updateValueAndValidity();
      emptyConditions[key] = this.defaultConditions[key] || null;
    }
    this.mergeConditions2Filter(Object.assign({}, this.getFilterData(), {...emptyConditions, pageIndex: 1}));
  }

  public checkAll(isChecked: boolean): void {
    if (isChecked) {
      this.records.forEach(item => (this.checkedIdSet.add(this.getItemId(item))));
    } else {
      this.records.forEach(item => (this.checkedIdSet.delete(this.getItemId(item))));
    }
    this.refreshStatus();
  }

  public updateItemCheck(item, isChecked) {
    if (isChecked) {
      this.checkedIdSet.add(this.getItemId(item));
    } else {
      this.checkedIdSet.delete(this.getItemId(item));
    }
    this.refreshStatus();
  }

  public getItemCheck(item) {
    return this.checkedIdSet.has(this.getItemId(item));
  }

  public getItemId(item: ItemType) {
    return (item as any).id;
  }

  public nzPageIndexChange(pageIndex: number) {
    this.mergeConditions2Filter({pageIndex});
  }

  public sort({key, value}: { key: string, value: 'descend' | 'ascend' | null | string }) {
    this.sortMap.set(key, value);
    const sortConditions = {};
    for (const sortKey of this.sortMap.keys()) {
      sortConditions[`isOrderBy${sortKey.slice(0, 1).toUpperCase()}${sortKey.slice(1)}`] = (() => {
        switch (this.sortMap.get(sortKey)) {
          case 'descend':
            return 'DESC';
          case 'ascend':
            return 'ASC';
          default:
            return null;
        }
      })();
    }
    this.mergeConditions2Filter(sortConditions);
  }

  mergeConditions2Filter(conditions) {
    const newConditions = this.conditionsSanitizer(conditions);
    const dto = Object.assign({}, this.defaultConditions, this.conditions, conditions, newConditions);
    const cleanedDto = {} as QueryDtoType;
    for (const key of Object.keys(dto)) {
      if (dto[key] !== null && dto[key] !== undefined) {
        cleanedDto[key] = dto[key];
      }
    }
    console.log('merge', conditions, 'to', cleanedDto);
    this.filtersSubject.next(cleanedDto);
  }

  setConditions2Filter(conditions) {
    const dto = this.conditionsSanitizer(conditions);
    const cleanedDto = {} as QueryDtoType;
    for (const key of Object.keys(dto)) {
      if (dto[key] !== null && dto[key] !== undefined) {
        cleanedDto[key] = dto[key];
      }
    }
    // console.log('merge', conditions, 'to', cleanedDto);
    this.filtersSubject.next(cleanedDto);
  }

  conditionsSanitizer(conditions) {
    const newConditions = {...conditions};
    sanitize(newConditions);
    return newConditions;
  }

  pageSizeChange(pageSize: number) {
    this.mergeConditions2Filter({pageSize});
  }

  remoteRemove(data: ItemType): Observable<any> {
    return throwError(new AppException('remoteRemove'));
  }

  remoteUpdate(oldItem: ItemType, updateDto: any): Observable<any> {
    return throwError(new AppException('remoteUpdate'));
  }

  remoteBatchUpdate(oldItems: ItemType[], updateDto: any): Observable<any> {
    return throwError(new AppException('remoteBatchUpdate'));
  }

  async remove({controlSubject}: AsyncTaskRequest, data: any) {
    try {
      await this.remoteRemove(data).subscribe(
        () => {
          this.refreshList();
          controlSubject.next({status: 'success'});
        },
        error => {
          controlSubject.next({status: 'failed'});
        }
      );
    } catch (e) {

    }
  }

  updateListItem(updateDto: any, oldItem: ItemType, $event: AsyncTaskRequest = null) {
    return this.remoteUpdate(oldItem, updateDto).pipe(
      tap(
        () => {
          this.updateLocalListItem(this.getItemId(oldItem), updateDto);
          if ($event) {
            $event.controlSubject.next({status: 'success'});
            this.message.success('更新成功！');
            $event.controlSubject.complete();
          }
        },
        error => {
          if ($event) {
            $event.controlSubject.error(error);
            this.message.warning('更新失败！');
            $event.controlSubject.complete();
          }
        },
      ),
    );
  }

  batchUpdateListItems(updateDto: any, oldItems: ItemType[], $event: AsyncTaskRequest = null) {
    return this.remoteBatchUpdate(oldItems, updateDto).pipe(
      tap(
        () => {
          oldItems.forEach(oldItem => {
            this.updateLocalListItem(this.getItemId(oldItem), updateDto);
          });
          if ($event) {
            $event.controlSubject.next({status: 'success'});
            this.message.success('更新成功！');
            $event.controlSubject.complete();
          }
        },
        error => {
          if ($event) {
            $event.controlSubject.error(error);
            this.message.warning('更新失败！');
            $event.controlSubject.complete();
          }
        }
      )
    );
  }

  updateLocalListItem(id: number | string, updateDto) {
    const index = this.records.findIndex(item => this.getItemId(item) === id);
    if (index !== -1) {
      this.records[index] = Object.assign({}, this.records[index], updateDto);
      this.records = this.records.slice();
    }
  }

  refreshList() {
    this.mergeConditions2Filter(this.conditions);
  }

  getCheckedIds() {
    return this.checkedIdSet.keys();
  }

  getCheckedItems() {
    const ids = new Set(this.getCheckedIds());
    return this.records.filter(item => ids.has(item.id));
  }

  async batchUpdate(updateDto: any, checker: (item: ItemType) => string = null, $event: AsyncTaskRequest = null) {
    try {
      const oldItems = this.getCheckedItems();
      if (oldItems.length === 0) {
        $event.controlSubject.next({status: 'failed'});
        this.message.info('您尚未选择任一记录');
        $event.controlSubject.complete();
        return;
      }
      if (checker) {
        for (const oldItem of oldItems) {
          const tmp = checker(oldItem);
          if (tmp) {
            throw new AppException(tmp);
          }
        }
      }
      await Promise.all(oldItems.map(oldItem => this.updateListItem(updateDto, oldItem).toPromise()));
      if ($event) {
        $event.controlSubject.next({status: 'success'});
        this.message.success('批量更新成功！');
        $event.controlSubject.complete();
      }
    } catch (e) {
      $event.controlSubject.error(e);
      this.message.warning('批量更新失败！');
      $event.controlSubject.complete();
    }
  }

  async batchUpdateByItems(updateDto: any, checker: (item: ItemType) => string = null, $event: AsyncTaskRequest = null) {
    try {
      const oldItems = this.getCheckedItems();
      if (oldItems.length === 0) {
        $event.controlSubject.next({status: 'failed'});
        this.message.info('您尚未选择任一记录');
        $event.controlSubject.complete();
        return;
      }
      if (checker) {
        for (const oldItem of oldItems) {
          const tmp = checker(oldItem);
          if (tmp) {
            throw new AppException(tmp);
          }
        }
      }
      await this.batchUpdateListItems(updateDto, oldItems).toPromise();
      if ($event) {
        $event.controlSubject.next({status: 'success'});
        this.message.success('批量更新成功！');
        $event.controlSubject.complete();
      }
    } catch (e) {
      $event.controlSubject.error(e);
      this.message.warning('批量更新失败！');
      $event.controlSubject.complete();
    }
  }

  filter(field: string, result: any[] | any) {
    this.mergeConditions2Filter({
      [field]: result,
    });
  }

  protected initialize() {
    this.watch4FetchList();
    this.watch4FilterForm();
    this.watch4TableFilters();
    this.watch4Conditions();
  }

  protected destroy() {
    this.isIndeterminate = false;
    this.isAllChecked = false;
    this.checkedIdSet = new Set();
    this.filterForm.reset();
    super.destroy();
  }

  protected getFetchListObservable(conditions: QueryDtoType): Observable<ListType> {
    return of({
      count: 0,
      records: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    } as ListType).pipe(tap(() => log('发起查询 %o', conditions)));
  }

  protected getFilterData() {
    return this.filterForm.value;
  }

  protected refreshStatus(): void {
    this.isAllChecked = this.records.every(item => this.checkedIdSet.has(this.getItemId(item)));
    this.isIndeterminate = !this.isAllChecked && this.records.some(item => this.checkedIdSet.has(this.getItemId(item)));
    this.numberOfChecked = this.records.filter(item => this.checkedIdSet.has(this.getItemId(item))).length;
  }

  protected mergeConditions(conditions) {
    return Object.assign({}, this.baseConditions, {
      ...conditions,
      pageIndex: +conditions.pageIndex || this.baseConditions.pageIndex,
      pageSize: +conditions.pageSize || this.baseConditions.pageSize,
    });
  }

  protected getFilters$() {
    return merge(
      this.filtersSubject,
      timer(100).pipe(
        map(() => this.defaultConditions),
        takeUntil(this.filtersSubject),
      ),
    ).pipe(
      map(conditions => this.mergeConditions(conditions)),
      shareReplay(1),
    );
  }

  protected getRecords$(): Observable<any[]> {
    return this.listDto$.pipe(pluck<ListType, ItemType[]>('records'));
  }

  protected getListDtoSubject(): Subject<ListType> {
    return new ReplaySubject<ListType>(1);
  }

  private watch4FetchList() {
    return this.filters$.pipe(
      takeUntil(this.destroyed$),
      tap(() => this.isLoading = true),
      debounceTime(300),
      switchMap(conditions => {
        conditions = {...conditions};
        if (conditions.otherField) {
          conditions[conditions.otherField] = conditions.otherValue;
          delete conditions.otherField;
          delete conditions.otherValue;
        }
        return this.getFetchListObservable(Object.assign({}, this.defaultConditions, conditions)).pipe(
          map(dto => {
            dto.count = +dto.count;
            return dto;
          }),
          catchError(err => {
            this.isLoading = false;
            console.error(err);
            this.message.error('数据加载失败！');
            return of(err);
          }),
        );
      }),
      filter(value => !(value instanceof AppException))
    ).subscribe(
      dto => {
        this.records = dto.records;
        this.totalCount = dto.count;
        this.isLoading = false;
        this.listResSubject.next(dto);
        this.listDtoSubject.next(dto);
      },
      err => {
        this.isLoading = false;
        console.error(err);
        this.message.error('数据加载失败，请稍后尝试刷新页面！');
      });
  }

  private watch4FilterForm() {
    return this.filters$.pipe(
      takeUntil(this.destroyed$),
      debounceTime(100),
    ).subscribe(
      conditions => {
        this.filterForm.reset(this.defaultConditions, {emitEvent: false});
        // console.log('conditions', conditions);
        this.filterForm.patchValue(conditions);
        this.patchSortMap(conditions);
      },
      err => {
        this.message.error('数据筛选条件异常！');
      });
  }

  private patchSortMap(conditions) {
    Object.keys(conditions).filter(key => key.indexOf('isOrderBy') === 0).forEach(key => {
      this.sortMap.set(key.slice(9, 10).toLowerCase().concat(key.slice(10)), (() => {
        switch (conditions[key]) {
          case 'DESC':
            return 'descend';
          case 'ASC':
            return 'ascend';
          default:
            return null;
        }
      })());
    });
  }

  private watch4Conditions() {
    return this.filters$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(conditions => {
      this.conditions = conditions;
    });
  }

  private watch4TableFilters() {
    this.filters$.pipe(
    ).subscribe(conditions => {
      for (const key of Object.keys(this.optionsOfFilters)) {
        const options: NzThFilterType = this.optionsOfFilters[key];
        if (conditions.hasOwnProperty(key)) {
          const value = this.optionsOfFilters[key];
          const valueArr = Array.isArray(value) ? value : [value];
          options.forEach(option => option.byDefault = valueArr.includes(option.value));
        } else {
          options.forEach(option => option.byDefault = false);
        }
      }
    });
  }
}
