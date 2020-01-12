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
import {map, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {QueryMembersDto} from './query-members.dto';
import {Account} from '../models/account';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent extends BaseIndexComponent<QueryMembersDto, Account> implements OnInit {
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

  batchEnable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: true}, null, $event);
  }

  batchDisable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: false}, null, $event);
  }

  protected getFetchListObservable(conditions): Observable<BaseListDto<any>> {
    return this.membersService.fetchList(conditions).pipe(
    );
  }
}

