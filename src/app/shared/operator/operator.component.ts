import {Component, Input, Optional, Self} from '@angular/core';
import {BaseEntityIdSelectorComponent} from '../base-entity-id-selector/base-entity-id-selector.component';
import {FormControlName, NgControl} from '@angular/forms';
import {UsersService} from '../../core/services/users.service';
import {map, pluck} from 'rxjs/operators';

@Component({
  selector: 'app-operator',
  templateUrl: '../base-entity-id-selector/base-entity-id-selector.component.html',
  styleUrls: ['../base-entity-id-selector/base-entity-id-selector.component.scss']
})
// @ts-ignore
export class OperatorComponent extends BaseEntityIdSelectorComponent {
  readonly placeholder = '操作者名称';
  get isNeedSuperAdmin(): boolean {
    return this.localIsNeedSuperAdmin;
  }

  @Input()
  set isNeedSuperAdmin(value: boolean) {
    this.localIsNeedSuperAdmin = value;
  }

  private localIsNeedSuperAdmin = false;

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private usersService: UsersService,
  ) {
    super(ngControl, controlName);
  }

  fetchData = ((keyword, skip, take) => this.usersService.fetchList({ take, skip, nick: keyword }).pipe(
    pluck('rows'),
    map(rows => rows.map(row => ({label: row.nick, value: row.id})))
  ));
  fetchOldOne = (id => this.usersService.fetchOne(id).pipe(
    map(row => ({label: row.nick, value: row.id})),
  ));
}
