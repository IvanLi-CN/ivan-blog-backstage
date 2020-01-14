import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseListDto} from '../models/base-list.dto';
import {map, pluck, take} from 'rxjs/operators';
import {QueryUsersDto} from '../models/query-users.dto';
import {Apollo} from 'apollo-angular';
import {Account} from '../../admin/accounts/models/account';
import gql from 'graphql-tag';
import {QueryMembersDto} from '../../admin/accounts/members/query-members.dto';
import {QueryAccountsDto} from '../../admin/accounts/dtos/query-accounts.dto';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  constructor(
    private readonly apollo: Apollo,
  ) {
  }

  fetchOne(id: number): Observable<Account> {
    return this.apollo.watchQuery<Account>({
      query: gql`
        query account($id: Int!) {
          account(id: $id) {
            account,
            id,
            createdAt,
            isActive,
          }
        }
      `,
      variables: {
        id,
      }
    }).valueChanges.pipe(
      pluck('data')
    );
  }

  fetchList(queryDto: QueryAccountsDto): Observable<BaseListDto<Account>> {
    return this.apollo.watchQuery<{accounts: Account[], accountsCount: number}>({
      query: gql`
        query accounts(
          $account: String,
          $nick: String,
          $pageIndex: Int,
          $pageSize: Int,
          $isActive: Boolean,
        ) {
          accounts(
            account: $account,
            nick: $nick,
            pageIndex: $pageIndex,
            pageSize: $pageSize,
            isActive: $isActive,
          ) {
            account,
            id,
            nick,
            createdAt,
            isActive,
          },
          accountsCount(
            account: $account,
            nick: $nick,
            pageIndex: $pageIndex,
            pageSize: $pageSize,
            isActive: $isActive,
          )
        }
      `,
      variables: {
        ...queryDto,
      }
    }).valueChanges.pipe(
      map(ref => ref.data),
      map(data => ({
        records: data.accounts,
        count: data.accountsCount,
      })),
    );
  }
}
