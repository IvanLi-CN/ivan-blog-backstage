import {combineLatest, merge, Observable, of, ReplaySubject, Subject, Subscription, throwError, timer} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseListDto} from './models/base-list.dto';
import {
  catchError,
  debounceTime,
  filter,
  map,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseQueryDto} from './models/base-query.dto';
import {AsyncTaskRequest} from './models/AsyncTaskRequest';
import {AppException} from './exceptions/app-exception';
import {OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';

export class BaseIndexComponent<
  QueryDto extends BaseQueryDto = BaseQueryDto, ListItem = any, ListDto extends BaseListDto<ListItem> = BaseListDto<ListItem>
  > implements OnInit, OnDestroy {
  protected readonly filterForm = this.fb.group({});
  isCollapsed = true;
  protected readonly baseConditions: BaseQueryDto = new BaseQueryDto();
  protected readonly defaultConditions: QueryDto = {} as QueryDto;
  protected readonly filtersSubject = new Subject<QueryDto>();
  public readonly filters$: Observable<QueryDto> = this.getFilters$();
  listDtoSubject: Subject<ListDto> = this.getListDtoSubject();
  readonly listDto$: Observable<ListDto> = this.listDtoSubject;
  public records$ = this.getRecords$();
  isLoading = false;
  records: any[] = [];
  totalCount = 0;
  checkedIdSet = new Set<any>();
  isIndeterminate = false;
  isAllChecked = false;
  numberOfChecked: number;
  conditions: QueryDto = null;
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
  pageSize$: Observable<number> = this.filters$.pipe(pluck('take'), startWith(0));
  sortMap = new Map<string, string>();
  private listResSubject = new Subject<any>();
  listRes$: Observable<any> = this.listResSubject.pipe();
  private watch4FetchListSubscription: Subscription;
  private watch4FilterSubscription: Subscription;
  private watch4RouteSubscription: Subscription;
  private watch4FilterFormSubscription: Subscription;
  private watch4conditionsSubscription: Subscription;

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
  }

  get pageIndex$() {
    return this.filters$.pipe(
      map(conditions => Math.ceil((conditions.skip || this.baseConditions.skip) / (conditions.take || this.baseConditions.take) + 1))
    );
  }

  get pageCount() {
    return Math.ceil(this.totalCount / this.baseConditions.take);
  }

  ngOnInit(): void {
    this.initialized();
  }

  ngOnDestroy(): void {
    this.free();
  }

  public onSubmit($event = null) {
    // tslint:disable-next-line:no-unused-expression
    $event && $event.preventDefault();
    this.filterForm.updateValueAndValidity();
    this.mergeConditions2Filter(Object.assign({}, this.getFilterData(), { pageIndex: 1 }));
  }

  public resetFilter($event) {
    $event.preventDefault();
    this.filterForm.reset(this.defaultConditions);
    const emptyConditions = {};
    for (const key of Object.keys(this.filterForm.controls)) {
      this.filterForm.controls[key].markAsPristine();
      this.filterForm.controls[key].updateValueAndValidity();
      emptyConditions[key] = this.defaultConditions[key] || null;
    }
    this.mergeConditions2Filter(Object.assign({}, this.getFilterData(), { ...emptyConditions, pageIndex: 1 }));
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

  public getItemId(item: ListItem) {
    return (item as any).id;
  }

  public nzPageIndexChange(pageIndex: number) {
    this.mergeConditions2Filter({ pageIndex });
  }

  public sort({ key, value }: { key: string, value: 'descend' | 'ascend' | null | string }) {
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
    let newConditions = { ...conditions };
    const oldConditions = this.conditions;
    // tslint:disable-next-line:no-unused-expression
    newConditions.pageSize && (newConditions.take = +newConditions.pageSize);
    if (newConditions.pageIndex) {
      newConditions = Object.assign(
        {},
        newConditions,
        { skip: (newConditions.pageIndex - 1) * (newConditions.take || oldConditions.take) },
      );
    }
    delete newConditions.pageSize;
    delete newConditions.pageIndex;
    const dto = Object.assign({}, this.defaultConditions, oldConditions, newConditions);
    const cleanedDto = {} as QueryDto;
    for (const key of Object.keys(dto)) {
      if (dto[key] !== null && dto[key] !== undefined) {
        cleanedDto[key] = dto[key];
      }
    }
    // console.log('merge', conditions, 'to', cleanedDto);
    this.filtersSubject.next(cleanedDto);
  }

  pageSizeChange(pageSize: number) {
    this.mergeConditions2Filter({ pageSize });
  }

  remoteRemove(data: ListItem): Observable<any> {
    return throwError(new AppException('remoteRemove'));
  }

  remoteUpdate(oldItem: ListItem, updateDto: any): Observable<any> {
    return throwError(new AppException('remoteUpdate'));
  }

  remoteBatchUpdate(oldItems: ListItem[], updateDto: any): Observable<any> {
    return throwError(new AppException('remoteBatchUpdate'));
  }

  async remove({ controlSubject }: AsyncTaskRequest, data: any) {
    try {
      await this.remoteRemove(data).subscribe(
        () => {
          this.refreshList();
          controlSubject.next({ status: 'success' });
        },
        error => {
          controlSubject.next({ status: 'failed' });
        }
      );
    } catch (e) {

    }
  }

  updateListItem(updateDto: any, oldItem: ListItem, $event: AsyncTaskRequest = null) {
    return this.remoteUpdate(oldItem, updateDto).pipe(
      tap(
        () => {
          this.updateLocalListItem(this.getItemId(oldItem), updateDto);
          if ($event) {
            $event.controlSubject.next({ status: 'success' });
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

  batchUpdateListItems(updateDto: any, oldItems: ListItem[], $event: AsyncTaskRequest = null) {
    return this.remoteBatchUpdate(oldItems, updateDto).pipe(
      tap(
        () => {
          oldItems.forEach(oldItem => {
            this.updateLocalListItem(this.getItemId(oldItem), updateDto);
          });
          if ($event) {
            $event.controlSubject.next({ status: 'success' });
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
    this.mergeConditions2Filter({});
  }

  getCheckedIds() {
    return this.checkedIdSet.keys();
  }

  getCheckedItems() {
    const ids = new Set(this.getCheckedIds());
    return this.records.filter(item => ids.has(item.id));
  }

  async batchUpdate(updateDto: any, checker: (item: ListItem) => string = null, $event: AsyncTaskRequest = null) {
    try {
      const oldItems = this.getCheckedItems();
      if (oldItems.length === 0) {
        $event.controlSubject.next({ status: 'failed' });
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
        $event.controlSubject.next({ status: 'success' });
        this.message.success('批量更新成功！');
        $event.controlSubject.complete();
      }
    } catch (e) {
      $event.controlSubject.error(e);
      this.message.warning('批量更新失败！');
      $event.controlSubject.complete();
    }
  }

  async batchUpdateByItems(updateDto: any, checker: (item: ListItem) => string = null, $event: AsyncTaskRequest = null) {
    try {
      const oldItems = this.getCheckedItems();
      if (oldItems.length === 0) {
        $event.controlSubject.next({ status: 'failed' });
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
        $event.controlSubject.next({ status: 'success' });
        this.message.success('批量更新成功！');
        $event.controlSubject.complete();
      }
    } catch (e) {
      $event.controlSubject.error(e);
      this.message.warning('批量更新失败！');
      $event.controlSubject.complete();
    }
  }

  toAgencyManagement(commands: any, queryParams: any) {
    console.error('作废');
  }

  protected initialized() {
    // this.filters$ = ;
    // this.getRecords$();
    this.watch4FetchListSubscription = this.watch4FetchList();
    this.watch4FilterSubscription = this.watch4Filter();
    this.watch4RouteSubscription = this.watch4Route();
    this.watch4FilterFormSubscription = this.watch4FilterForm();
    this.watch4conditionsSubscription = this.watch4Conditions();
  }

  protected free() {
    this.isIndeterminate = false;
    this.isAllChecked = false;
    this.checkedIdSet = new Set();
    this.filterForm.reset();
    // tslint:disable-next-line:no-unused-expression
    this.watch4FetchListSubscription && this.watch4FetchListSubscription.unsubscribe();
    // tslint:disable-next-line:no-unused-expression
    this.watch4FilterSubscription && this.watch4FilterSubscription.unsubscribe();
    // tslint:disable-next-line:no-unused-expression
    this.watch4RouteSubscription && this.watch4RouteSubscription.unsubscribe();
    // tslint:disable-next-line:no-unused-expression
    this.watch4FilterFormSubscription && this.watch4FilterFormSubscription.unsubscribe();
  }

  protected getFetchListObservable(conditions: QueryDto): Observable<BaseListDto<ListItem>> {
    // tslint:disable-next-line:no-console
    // @ts-ignore
    return of({
      count: 0,
      rows: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    }).pipe(tap(() => console.debug('发起查询', conditions)));
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
      skip: +conditions.skip || this.baseConditions.skip,
      take: +conditions.take || this.baseConditions.take,
    });
  }

  private watch4FetchList() {
    return this.filters$.pipe(
      tap(() => this.isLoading = true),
      debounceTime(100),
      switchMap(conditions => {
        conditions = { ...conditions };
        if (conditions.baseDateRange) {
          if (conditions.baseDateRange[0]) {
            conditions.startAt = moment(conditions.baseDateRange[0]).startOf('d').toISOString();
          }
          if (conditions.baseDateRange[1]) {
            conditions.endAt = moment(conditions.baseDateRange[1]).endOf('d').toISOString();
          }
          delete conditions.baseDateRange;
        }
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
        this.records = dto.rows;
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
    return this.listDto$.pipe(pluck<ListDto, ListItem[]>('rows'));
  }

  private watch4Filter() {
    return this.route.queryParams.subscribe(
      conditions => {
        // console.log('queryParams', conditions);
        this.mergeConditions2Filter(conditions);
      },
      err => {
        this.message.error('数据筛选条件异常！');
      });
  }

  private watch4FilterForm() {
    return this.filters$.pipe(
      debounceTime(100),
    ).subscribe(
      conditions => {
        this.filterForm.patchValue(conditions);
        this.patchSortMap(conditions);
      },
      err => {
        this.message.error('数据筛选条件异常！');
      });
  }

  private watch4Route() {
    return combineLatest([
      this.filters$,
    ]).subscribe(
      ([conditions]) => {
        this.router.navigate(
          ['./'],
          { relativeTo: this.route, queryParams: conditions, replaceUrl: true },
        ).then();
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
    return this.filters$.subscribe(conditions => {
      this.conditions = conditions;
    });
  }

  protected getListDtoSubject(): Subject<ListDto> {
    return new ReplaySubject<ListDto>(1);
  }
}
