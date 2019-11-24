import {Component, OnInit} from '@angular/core';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {MembersService} from './members.service';
import {map} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    isActive: [null],
    nick: [null],
    username: [null],
    otherField: ['realName', Validators.required],
    otherValue: [null],
    hierarchyId: [null],
    agentId: [null],
    parentId: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public activeStatusesService: ActiveStatusesService,
    private membersService: MembersService,
  ) {
    super(fb, message, route, router);
  }

  remoteRemove(data: any) {
    return this.membersService.remove(this.getItemId(data));
  }

  remoteUpdate(oldItem, updateDto) {
    return this.membersService.modify(this.getItemId(oldItem), updateDto);
  }

  batchEnable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: true}, null, $event);
  }

  batchDisable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: false}, null, $event);
  }

  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.membersService.fetchList(conditions).pipe(
      map(dto => ({
        ...dto,
        rows: dto.rows.map(item => ({
          ...item,
          isOnline: item.lastActiveAt && moment.unix(item.lastActiveAt / 1000).diff(moment(), 'minutes') > -5,
        }))
      }))
    );
  }

  async focusDownLine(data: any, $event: AsyncTaskRequest) {
    try {
      await this.membersService.focusDownLine(this.getItemId(data)).toPromise();
      if ($event) {
        $event.controlSubject.next({ status: 'success' });
        this.message.success('已强制下线！');
        $event.controlSubject.complete();
      }
    } catch (e) {
      $event.controlSubject.error(e);
      this.message.warning('强制下线失败！');
      $event.controlSubject.complete();
    }
  }
}

