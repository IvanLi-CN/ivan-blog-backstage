import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../core/enums/active-statuses.service';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {NzMessageService} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {HierarchiesService} from './hierarchies.service';
import {tap} from 'rxjs/operators';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';

@Component({
  selector: 'app-hierarchies-index',
  templateUrl: './hierarchies-index.component.html',
  styleUrls: ['./hierarchies-index.component.scss']
})
export class HierarchiesIndexComponent extends BaseIndexComponent<any, any> implements OnInit {
  readonly filterForm = this.fb.group({
    name: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public activeStatusesService: ActiveStatusesService,
    private hierarchiesService: HierarchiesService
  ) {
    super(fb, message, route, router);
  }

  protected getFetchListObservable(conditions: any): Observable<BaseListDto<any>> {
    return this.hierarchiesService.fetchList(conditions);
  }

  remoteRemove(data: any) {
    return this.hierarchiesService.remove(this.getItemId(data));
  }

  remoteUpdate(oldItem, updateDto) {
    return this.hierarchiesService.modify(this.getItemId(oldItem), updateDto).pipe(tap(console.log));
  }

  setDefault(data: any, $event: AsyncTaskRequest) {
    this.updateListItem({isDefault: true}, data, $event).subscribe(() => {
      this.records.filter(record => record.id !== this.getItemId(data)).forEach(record => record.isDefault = false);
    });
  }
}
