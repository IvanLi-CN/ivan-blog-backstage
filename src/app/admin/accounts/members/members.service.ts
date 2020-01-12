import {Injectable, QueryList} from '@angular/core';
import {Observable} from 'rxjs';
import {map, pluck, take, tap} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Account} from '../models/account';
import {QueryMembersDto} from './query-members.dto';
import {BaseListDto} from '../../../core/models/base-list.dto';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
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

  fetchList(queryDto: QueryMembersDto): Observable<BaseListDto<Account>> {
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
