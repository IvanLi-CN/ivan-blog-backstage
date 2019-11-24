import {Component, Optional, Self} from '@angular/core';
import {FormControlName, NgControl} from '@angular/forms';
import {map, pluck} from 'rxjs/operators';
import {BaseEntityIdSelectorComponent} from '../base-entity-id-selector/base-entity-id-selector.component';
import {PlatformListService} from '../../admin/game-administration/platform-list/platform-list.service';

@Component({
  selector: 'app-platform-selector',
  templateUrl: '../base-entity-id-selector/base-entity-id-selector.component.html',
  styleUrls: ['../base-entity-id-selector/base-entity-id-selector.component.scss']
})
// @ts-ignore
export class PlatformSelectorComponent extends BaseEntityIdSelectorComponent {
  readonly placeholder = '平台名称';
  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private platformListService: PlatformListService,
  ) {
    super(ngControl, controlName);
  }
  fetchOldOne = (id => this.platformListService.fetchOne(id).pipe(
    map(row => ({label: row.platform, value: row.id})),
  ));
  fetchData = keyword => this.platformListService.fetchList({ take: 100, platform: keyword }).pipe(
    pluck('rows'),
    map(rows => rows.map(row => ({label: row.platform, value: row.id})))
  )
}
