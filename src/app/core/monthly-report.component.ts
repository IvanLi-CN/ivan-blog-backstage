import {BaseIndexComponent} from './base-index.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseQueryDto} from './models/base-query.dto';
import {BaseListDto} from './models/base-list.dto';
import {BehaviorSubject, combineLatest, from, Observable, of} from 'rxjs';
import * as moment from 'moment';
import {Moment} from 'moment';
import {filter, map, pluck, switchMap, take, tap, toArray} from 'rxjs/operators';
import Decimal from 'decimal.js';
import {DateHelperService} from './services/date-helper.service';
import {MonthlyReportRecordDto} from './models/monthly-report-record.dto';

export class MonthlyReportComponent<QueryDtoType extends BaseQueryDto,
  ItemType extends MonthlyReportRecordDto,
  ListType extends BaseListDto<ItemType> = BaseListDto<ItemType>,
  > extends BaseIndexComponent<QueryDtoType, ItemType, ListType> {
  readonly defaultConditions = {dateRange: moment().startOf('months').toDate()} as any;

  isFirstHalfMonthSubject = new BehaviorSubject<boolean>(true);
  arrDateOfCurrMonth$: Observable<Moment[]> = this.getArrDateOfCurrMonth();
  arrDateOfCurrRange$: Observable<Moment[]> = this.getArrDateOfCurrRange();
  arrData4CurrRange$: Observable<any> = this.getArrData4CurrRange();
  startAtString$ = this.filters$.pipe(
    pluck('dateRange'),
    map(date => moment(date).startOf('months').toISOString()),
  );
  endAtString$ = this.filters$.pipe(
    pluck('dateRange'),
    map(date => moment(date).endOf('months').toISOString()),
  );

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public dateHelperService: DateHelperService,
  ) {
    super(fb, message, route, router);
  }

  getItemValue(item) {
    return item.value;
  }

  getRecordItems(item) {
    return item.result;
  }

  getItemDate(item) {
    return item.date;
  }

  switchFirstHalfMonth() {
    this.isFirstHalfMonthSubject.pipe(
      take(1)
    ).subscribe(flag => {
      this.isFirstHalfMonthSubject.next(!flag);
    });
  }

  getItem(item): object {
    return {
      value: item.value,
    };
  }

  protected getFetchListObservable(conditions: QueryDtoType): Observable<ListType> {
    // tslint:disable-next-line:no-console
    // @ts-ignore
    return of({
      count: 0,
      rows: Array.from({length: 2}, () => ({result: []})),
    }).pipe(tap(() => console.debug('发起查询', conditions)));
  }

  private objTotalize(arr: any[]) {
    const totalObj = {};
    for (const item of arr) {
      for (const key of Object.keys(item)) {
        if (key === 'date') {
          continue;
        }
        if (totalObj[key] === undefined) {
          totalObj[key] = new Decimal(item[key]);
        } else {
          totalObj[key] = Decimal.add(totalObj[key], item[key]);
        }
      }
    }
    for (const key of Object.keys(totalObj)) {
      totalObj[key] = new Decimal(totalObj[key]).toNumber();
    }
    return totalObj;
  }

  protected initialized() {
    super.initialized();
    this.getArrDateOfCurrMonth();
    this.getArrDateOfCurrRange();
    this.getArrData4CurrRange();
  }

  private getArrData4CurrRange() {
    return combineLatest([
      this.records$,
      this.arrDateOfCurrRange$,
      this.arrDateOfCurrMonth$,
    ]).pipe(
      filter(([records, arrDate, arrAllDate]) => !!records && !!arrDate && !!arrAllDate),
      switchMap(([records, arrDate, arrAllDate]) =>
        from(records).pipe(
          map((record: MonthlyReportRecordDto) => {
            const infoSet = this.getRecordItems(record).map(item => ({
              ...item,
              date: moment(this.getItemDate(item)).startOf('day'),
            }));
            return ({
              ...record,
              listOfCurrRange: (() => {
                return arrDate.map(date => {
                  const matchedInfos = infoSet
                    .filter(item => item.date.isBetween(date, date, 'day', '[]'))
                    .map(item => this.getItem(item));
                  return {
                    ...this.objTotalize(matchedInfos),
                    date,
                  };
                });
              })(),
              listOfAll: (() => {
                return arrAllDate.map(date => {
                  const matchedInfos = infoSet
                    .filter(item => item.date.isBetween(date, date, 'day', '[]'))
                    .map(item => this.getItem(item));
                  return {
                    ...this.objTotalize(matchedInfos),
                    date,
                  };
                });
              })(),
            });
          }),
          map(item => {
            item.total = this.objTotalize(item.listOfAll);
            item.currRange = this.objTotalize(item.listOfCurrRange);
            return item;
          }),
          toArray(),
        )
      ),
    );
  }

  private getArrDateOfCurrRange() {
    return this.filters$.pipe(
      pluck('dateRange'),
      map(value => moment(value)),
      switchMap((month: Moment) => this.isFirstHalfMonthSubject.pipe(
        map(isFirstHalfMonth => {
          if (isFirstHalfMonth) {
            return {
              startAt: month.clone().startOf('month'),
              endAt: month.clone().startOf('month').add({day: 14}).endOf('day'),
            };
          } else {
            return {
              startAt: month.clone().startOf('month').add({day: 15}).startOf('day'),
              endAt: month.clone().endOf('month'),
            };
          }
        }),
      )),
      map(({startAt, endAt}) => {
        return this.dateHelperService.getTimeArr4Range(startAt, endAt, 'days');
      })
    );
  }

  private getArrDateOfCurrMonth() {
    return this.filters$.pipe(
      pluck('dateRange'),
      map(value => moment(value)),
      map((month: Moment) => ({
          startAt: month.clone().startOf('month'),
          endAt: month.clone().endOf('month'),
        })
      ),
      map(({startAt, endAt}) => {
        return this.dateHelperService.getTimeArr4Range(startAt, endAt, 'days');
      })
    );
  }
}
