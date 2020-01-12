import {Component, OnInit} from '@angular/core';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';
import {PlayerAgentsService} from './player-agents.service';
import {map, pluck, shareReplay, take, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {Moment} from 'moment';
import Decimal from 'decimal.js';
import {PlayerAgentDto} from './player-agent.dto';
import {TreeNodeInterface} from '../../../core/models/tree-note.interface';

@Component({
  selector: 'app-player-agents-index',
  templateUrl: './player-agents-index.component.html',
  styleUrls: ['./player-agents-index.component.scss']
})
export class PlayerAgentsIndexComponent extends BaseIndexComponent<any, PlayerAgentDto> implements OnInit {
  private refreshTableSubject = new BehaviorSubject(null);

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public activeStatusesService: ActiveStatusesService,
    private playerAgentsService: PlayerAgentsService
  ) {
    super(fb, message, route, router);
  }

  readonly filterForm = this.fb.group({
    isActive: [null],
    nick: [null],
    baseDateRange: [null],
    username: [null],
  });
  tree$ = (this.records$ as unknown as Observable<PlayerAgentDto[]>).pipe(
    map(records => {
      const rows: (PlayerAgentDto & TreeNodeInterface)[] = records.map(row => ({
        ...row,
        expand: false,
        level: null,
        children: null,
      }) as (PlayerAgentDto & TreeNodeInterface));
      const tree: (PlayerAgentDto & TreeNodeInterface)[] = [];
      for (const row of rows) {
        if (row.parentId === null) {
          tree.push(row);
          continue;
        }
        const parent = rows.find(item => item.id === row.parentId);
        if (!parent) {
          tree.push(row);
          continue;
        }
        if (Array.isArray(parent.children)) {
          parent.children.push(row);
        } else {
          parent.children = [row];
        }
      }
      return tree;
    }),
    tap(tree => this.setNodesLevel(tree)),
    tap(tree => tree.forEach(node => this.countData(node))),
    shareReplay(),
  );
  treeNodesList$ = combineLatest([
    this.tree$,
    this.refreshTableSubject,
  ]).pipe(
    pluck('0'),
    map(tree => this.getVisibleNodesList(tree)),
  );
  setNodesLevel(tree: TreeNodeInterface[], level = 1) {
    if (!Array.isArray(tree)) {
      return;
    }
    for (const item of tree) {
      if (!item.level) {
        item.level = level;
      }
      this.setNodesLevel(item.children, level + 1);
    }
  }
  countData(node: (PlayerAgentDto & TreeNodeInterface)) {
    node.totalPlayerCount = node.sumPlayerCount || 0;
    node.totalValidPlayerCount = node.validPlayerCount || 0;
    if (!Array.isArray(node.children)) {
      return node;
    }
    for (const child of node.children as (PlayerAgentDto & TreeNodeInterface)[]) {
      this.countData(child);
      node.totalPlayerCount = Decimal.add(node.totalPlayerCount, child.totalPlayerCount).toNumber();
      node.totalValidPlayerCount = Decimal.add(node.totalValidPlayerCount, child.totalValidPlayerCount).toNumber();
    }
  }
  getVisibleNodesList(nodes: TreeNodeInterface[]) {
    if (!Array.isArray(nodes)) {
      return [];
    }
    const list = [];
    for (const node of nodes) {
      list.push(node);
      if (node.expand) {
        list.push(...this.getVisibleNodesList(node.children));
      }
    }
    return list;
  }

  collapse(data: TreeNodeInterface, $event: boolean): void {
    data.expand = $event;
    this.refreshTableSubject.next(null);
  }

  remoteRemove(data: any) {
    return this.playerAgentsService.remove(this.getItemId(data));
  }

  remoteUpdate(oldItem, updateDto) {
    return this.playerAgentsService.modify(this.getItemId(oldItem), updateDto);
  }

  batchEnable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: true}, null, $event);
  }

  batchDisable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: false}, null, $event);
  }

  modifyItemRate(rate: number, oldItem: any) {
    this.playerAgentsService.modifyRate(this.getItemId(oldItem), rate).subscribe(() => {
      this.updateLocalListItem(this.getItemId(oldItem), {rate});
    });
  }

  async collapseAll($event: AsyncTaskRequest, flag: boolean) {
    const nodes = await this.tree$.pipe(take(1)).toPromise();
    this.collapseChildNode(nodes, flag);
    this.refreshTableSubject.next(null);
    // tslint:disable-next-line:no-unused-expression
    $event && $event.controlSubject.next({status: 'success'});
  }

  collapseChildNode(nodes: TreeNodeInterface[], flag: boolean) {
    if (!Array.isArray(nodes)) {
      return;
    }
    for (const node of nodes) {
      node.expand = flag;
      this.collapseChildNode(node.children, flag);
    }
  }

  protected getFetchListObservable(conditions: any): Observable<BaseListDto<PlayerAgentDto>> {
    return this.playerAgentsService.fetchList(conditions).pipe(
      map(dto => ({
        ...dto,
        records: dto.records.map(item => {
          const playerCountArr: { count: number, date: Moment }[] = item.todayPlayerCount.map(info => ({
            count: info.count,
            date: moment(info.date).startOf('days'),
          }));
          const today = moment().startOf('days');
          const yesterday = moment().subtract(1, 'days').startOf('days');
          const todayPlayerCountArr = playerCountArr.filter(info => today.isSame(info.date, 'days'));
          const yesterdayPlayerCountArr = playerCountArr.filter(info => yesterday.isSame(info.date, 'days'));
          const todayPlayerCount = todayPlayerCountArr.reduce((acc, curr) => Decimal.add(acc, curr.count).toNumber(), 0);
          const yesterdayPlayerCount = yesterdayPlayerCountArr.reduce((acc, curr) => Decimal.add(acc, curr.count).toNumber(), 0);
          return ({
            ...item,
            todayPlayerCount,
            yesterdayPlayerCount,
          });
        })
      })),
    );
  }
}
