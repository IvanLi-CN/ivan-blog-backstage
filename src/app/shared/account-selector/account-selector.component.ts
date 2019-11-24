import {Component, Optional, Self} from '@angular/core';
import {BaseEntityIdSelectorComponent} from '../base-entity-id-selector/base-entity-id-selector.component';
import {FormControlName, NgControl} from '@angular/forms';
import {UsersService} from '../../core/services/users.service';
import {map, pluck} from 'rxjs/operators';
import {UserTypes} from '../../core/enums/user-types.enum';

@Component({
  selector: 'app-account-selector',
  templateUrl: '../base-entity-id-selector/base-entity-id-selector.component.html',
  styleUrls: ['../base-entity-id-selector/base-entity-id-selector.component.scss']
})
// @ts-ignore
export class AccountSelectorComponent extends BaseEntityIdSelectorComponent {
  readonly placeholder = '昵称';
  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private usersService: UsersService,
  ) {
    super(ngControl, controlName);
  }

  fetchData = ((keyword, skip, take) => this.usersService.fetchList({
    take,
    skip,
    nick: keyword,
    types: [
      UserTypes.financialStaffDirector,
      UserTypes.financialStaffPaymentGroup,
      UserTypes.financialStaffDepositGroup,
      UserTypes.keFu,
      UserTypes.playerAgent,
      UserTypes.companyAgent,
      UserTypes.company,
      UserTypes.admin,
    ],
  }).pipe(
    pluck('rows'),
    map(rows => rows.map(row => ({label: row.nick, value: row.id})))
  ));
  fetchOldOne = (id => this.usersService.fetchOne(id).pipe(
    map(row => ({label: row.name, value: row.id})),
  ));
}
