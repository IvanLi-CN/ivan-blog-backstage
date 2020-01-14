import {Component, Optional, Self} from '@angular/core';
import {BaseEntityIdSelectorComponent} from '../base-entity-id-selector/base-entity-id-selector.component';
import {FormControlName, NgControl} from '@angular/forms';
import {AccountsService} from '../../core/services/accounts.service';
import {map, pluck} from 'rxjs/operators';

@Component({
  selector: 'app-account-selector',
  templateUrl: '../base-entity-id-selector/base-entity-id-selector.component.html',
  styleUrls: ['../base-entity-id-selector/base-entity-id-selector.component.scss']
})
// @ts-ignore
export class AccountSelectorComponent extends BaseEntityIdSelectorComponent<number> {
  readonly placeholder = '昵称';

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private accountsService: AccountsService,
  ) {
    super(ngControl, controlName);
  }

  fetchData(keyword, pageIndex, pageSize) {
    return this.accountsService.fetchList({
      pageIndex,
      pageSize,
      nick: keyword,
    }).pipe(
      pluck('records'),
      map(records => records.map(item => ({label: item.nick, value: item.id})))
    );
  }
  fetchOldOne(id) {
    return this.accountsService.fetchOne(id).pipe(
      map(item => ({label: item.nick, value: item.id})),
    );
  }
}
