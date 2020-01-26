import {combineLatest, Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseListDto} from './models/base-list.dto';
import {debounceTime} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseQueryDto} from './models/base-query.dto';
import {OnDestroy, OnInit} from '@angular/core';
import * as debug from 'debug';
import {BaseTableComponent} from './base-table.component';

const log = debug('ivan:base:index');

export class BaseIndexComponent<QueryDtoType extends BaseQueryDto = BaseQueryDto,
  ItemType = Record<string, any>,
  ListDtoType extends BaseListDto<ItemType> = BaseListDto<ItemType>,
  > extends BaseTableComponent<QueryDtoType, ItemType, ListDtoType> implements OnInit, OnDestroy {

  private watch4RouteSubscription: Subscription;

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    super(fb, message);
  }

  protected initialize() {
    this.watch4RouteSubscription = this.watch4Route();
    this.watch4Filter();
    super.initialize();
  }

  private watch4Filter() {

  }

  private watch4Route() {
    return combineLatest([
      this.filters$,
    ]).pipe(
      debounceTime(100),
    ).subscribe(
      ([conditions]) => {
        this.router.navigate(
          ['./'],
          {relativeTo: this.route, queryParams: conditions, replaceUrl: true},
        ).then();
      },
      err => {
        log('数据筛选条件异常！', err);
        this.message.error('数据筛选条件异常！');
      });
  }
}
