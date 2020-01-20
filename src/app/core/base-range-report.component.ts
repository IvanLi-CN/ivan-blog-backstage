import {BaseIndexComponent} from './base-index.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseQueryDto} from './models/base-query.dto';
import {BaseListDto} from './models/base-list.dto';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import * as moment from 'moment';
import {Moment} from 'moment';
import {distinct, map, mapTo, pluck, switchMap, tap, toArray} from 'rxjs/operators';
import Decimal from 'decimal.js';
import {DateHelperService} from './services/date-helper.service';
import {MonthlyReportRecordDto} from './models/monthly-report-record.dto';
import {AppException} from './exceptions/app-exception';
import * as debug from 'debug';

const log = debug('ivan:base:range-report');

export class BaseRangeReportComponent<QueryDto extends BaseQueryDto = BaseQueryDto,
  ItemType extends MonthlyReportRecordDto = MonthlyReportRecordDto,
  ListType extends BaseListDto<ItemType> = BaseListDto<ItemType>,
  > extends BaseIndexComponent<QueryDto, ItemType, ListType> {
  readonly defaultConditions = {baseDateRange: [moment().startOf('months').toDate(), moment().endOf('months').toDate()]} as any;
  readonly today$ = timer(0, 5000).pipe(
    mapTo(moment().startOf('days')),
    distinct(date => date.toISOString()),
  );
  readonly yesterday$ = this.today$.pipe(
    map(today => moment(today).subtract(1, 'days').startOf('days')),
  );
  readonly dateRange$: Observable<{ startAt: Moment, endAt: Moment }> = this.filters$.pipe(
    pluck('baseDateRange'),
    map(baseDateRange => ({
      startAt: moment(baseDateRange[0]).startOf('days'),
      endAt: moment(baseDateRange[1]).endOf('days'),
    })),
  );
  readonly arrData4CurrRange$: Observable<any> = combineLatest([
    this.records$,
    this.dateRange$,
    this.today$,
    this.yesterday$,
  ]).pipe(
    switchMap(([records, {startAt, endAt}, today, yesterday]) =>
      from(records).pipe(
        map((record: MonthlyReportRecordDto) => {
            const rawResults = this.getRecordItems(record);
            const results = {};
            for (const key of Object.keys(rawResults)) {
              if (!Array.isArray(rawResults[key].items)) {
                throw new AppException(`member ${key} IS NOT Array`);
              }
              const infoSet = rawResults[key].items.map(item => ({
                ...item,
                date: moment(rawResults[key].getItemDate(item)).startOf('days'),
              }));
              results[key] = {
                range: (() => {
                  const matchedInfos = infoSet
                    .filter(item => item.date.isBetween(startAt, endAt, 'days', '[]'))
                    .map(item => rawResults[key].getItem(item));
                  console.log('matchedInfos', matchedInfos);
                  return this.objTotalize(matchedInfos);
                })(),
                today: (() => {
                  const matchedInfos = infoSet
                    .filter(item => item.date.isBetween(today, today, 'days', '[]'))
                    .map(item => rawResults[key].getItem(item));
                  return this.objTotalize(matchedInfos);
                })(),
                yesterday: (() => {
                  const matchedInfos = infoSet
                    .filter(item => item.date.isBetween(yesterday, yesterday, 'days', '[]'))
                    .map(item => rawResults[key].getItem(item));
                  return this.objTotalize(matchedInfos);
                })(),
              };
            }

            return ({
              ...record,
              results,
            });
          },
        ),
        toArray(),
      ),
    )
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

  getRecordItems(record): { [rawSet: string]: { getItem: (item) => { [p: string]: any }; getItemDate: (item) => any; items: any } } {
    return {
      result: {
        items: record.result,
        getItem: item => {
          if (!item) {
            return {
              value: 0,
            };
          }
          return {
            value: item.value,
          };
        },
        getItemDate: item => item.date,
      }
    };
  }

  getItemDate(item) {
    return item.date;
  }

  protected getFetchListObservable(conditions: QueryDto): Observable<ListType> {
    // tslint:disable-next-line:no-console
    // @ts-ignore
    return of({
      count: 0,
      rows: Array.from({length: 2}, () => ({result: []})),
    }).pipe(tap(() => log('发起查询', conditions)));
  }

  private objTotalize(arr: any[]) {
    const totalObj = {};
    for (const item of arr) {
      for (const key of Object.keys(item)) {
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
}
