import { Component, OnInit } from '@angular/core';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {MemberLoginBlacklistService} from './member-login-blacklist.service';

@Component({
  selector: 'app-member-login-blacklist',
  templateUrl: './member-login-blacklist.component.html',
  styleUrls: ['./member-login-blacklist.component.scss']
})
export class MemberLoginBlacklistComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    ipAddress: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public activeStatusesService: ActiveStatusesService,
    public router: Router,
    public  memberLoginBlacklistService: MemberLoginBlacklistService,
  ) {
    super(fb, message, route, router);
  }


  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.memberLoginBlacklistService.fetchList(conditions);
  }

  remoteRemove(data: any) {
    return this.memberLoginBlacklistService.remove(this.getItemId(data));
  }
}


