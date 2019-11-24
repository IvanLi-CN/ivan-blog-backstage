import { Component, OnInit } from '@angular/core';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {PlatformListService} from './platform-list.service';
import {PlatformStatusesService} from './platform-statuses.service';
import {PlatformLevelService} from './platform-level.service';
import {map} from 'rxjs/operators';
import {CommonApiService} from '../../../core/services/common-api.service';

@Component({
  selector: 'app-platform-list',
  templateUrl: './platform-list.component.html',
  styleUrls: ['./platform-list.component.scss']
})
export class PlatformListComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    platformStatus: [null],
    platformLevel: [null],
    platform: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public activeStatusesService: ActiveStatusesService,
    public router: Router,
    private platformListService: PlatformListService,
    public  platformStatusesService: PlatformStatusesService,
    public  platformLevelService: PlatformLevelService,
    private commonApiService: CommonApiService,
  ) {
    super(fb, message, route, router);
  }


  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.platformListService.fetchList(conditions).pipe(
      map(dto => ({
        ...dto,
        rows: dto.rows.map(item => ({
          ...item,
          imageUrl$: this.commonApiService.getImageBlobUrl(item.imageUrl),
        }))
      })),
    );
  }

  remoteRemove(data: any) {
    return this.platformListService.remove(this.getItemId(data));
  }
}

