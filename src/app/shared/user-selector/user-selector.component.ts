import {Component, Optional, Self} from '@angular/core';
import {UsersService} from '../../core/services/users.service';
import {FormControlName, NgControl} from '@angular/forms';
import {map, pluck} from 'rxjs/operators';
import {BaseEntityIdSelectorComponent} from '../base-entity-id-selector/base-entity-id-selector.component';

@Component({
  selector: 'app-user-selector',
  templateUrl: '../base-entity-id-selector/base-entity-id-selector.component.html',
  styleUrls: ['../base-entity-id-selector/base-entity-id-selector.component.scss']
})
// @ts-ignore
export class UserSelectorComponent extends BaseEntityIdSelectorComponent{
  readonly placeholder = '账号';
  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private usersService: UsersService
  ) {
    super(ngControl, controlName);
  }
  fetchOldOne = (id => this.usersService.fetchOne(id).pipe(
    map(row => ({label: row.nick, value: row.id})),
  ));
  fetchData = keyword => this.usersService.fetchList({ take: 100, nick: keyword }).pipe(
    pluck('rows'),
    map(rows => rows.map(row => ({label: row.nick, value: row.id})))
  )
}

