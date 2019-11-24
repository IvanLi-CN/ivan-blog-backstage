import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseListDto} from '../models/base-list.dto';
import {take} from 'rxjs/operators';
import {QueryUsersDto} from '../models/query-users.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseApiService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  fetchList(queryDto: QueryUsersDto): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/users/getSimpleUsers',
      {params: this.convertQueryDtoToHttpParams(queryDto)}
    ).pipe(
      take(1),
    );
  }

}
