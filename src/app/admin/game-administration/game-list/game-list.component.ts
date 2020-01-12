import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {CommonApiService} from '../../../core/services/common-api.service';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {NzMessageService} from 'ng-zorro-antd';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GameListService} from './game-list.service';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    gameTypeId: [null],
    gameName: [null],
    playStationId: [null],
    isActive: [null],

  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public activeStatusesService: ActiveStatusesService,
    public router: Router,
    private gameListService: GameListService,
    private commonApiService: CommonApiService,
  ) {
    super(fb, message, route, router);
  }

  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.gameListService.fetchList(conditions).pipe(
      map(dto => ({
        ...dto,
        records: dto.records.map(item => ({
          ...item,
          imageUrl$: this.commonApiService.getImageBlobUrl(item.imageUrl),
        }))
      })),
    );
  }

  remoteRemove(data: any) {
    return this.gameListService.remove(this.getItemId(data));
  }
  batchEnable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: true}).then(() => {
      $event.controlSubject.next({status: 'success'});
      $event.controlSubject.complete();
    }).catch(err => {
      $event.controlSubject.next({status: 'failed'});
      $event.controlSubject.complete();
    });
  }

  batchDisable($event: AsyncTaskRequest) {
    this.batchUpdate({isActive: false}).then(() => {
      $event.controlSubject.next({status: 'success'});
      $event.controlSubject.complete();
    }).catch(err => {
      $event.controlSubject.next({status: 'failed'});
      $event.controlSubject.complete();
    });
  }
}
