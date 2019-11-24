import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';
import {GameTypeService} from './game-type.service';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-type',
  templateUrl: './game-type.component.html',
  styleUrls: ['./game-type.component.scss']
})
export class GameTypeComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    gameTypeName: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public activeStatusesService: ActiveStatusesService,
    public router: Router,
    private gameTypeService: GameTypeService
  ) {
    super(fb, message, route, router);
  }


  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.gameTypeService.fetchList(conditions);
  }

  remoteRemove(data: any) {
    return this.gameTypeService.remove(this.getItemId(data));
  }
}
