import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseApiService} from '../../../core/services/base-api.service';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {QueryGameTypeDto} from './query-game-type.dto';
import {QueryUsersDto} from '../../../core/models/query-users.dto';

@Injectable({
  providedIn: 'root'
})
export class GameTypeService extends BaseApiService<QueryUsersDto> {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  fetchList(queryDto: QueryGameTypeDto): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/gameType',
      {params: this.convertQueryDtoToHttpParams(queryDto)}
    ).pipe(
      take(1),
    );
  }

  fetchOne(id: number): Observable<any> {
    return this.http.get<any>(
      '/api/gameType',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
      map(dto => dto.rows[0]),
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(
      '/api/gameType',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
    );
  }

  create(dto): Observable<any> {
    return this.http.post<any>(
      '/api/gameType',
      dto,
    ).pipe(
      take(1),
    );
  }
  modify(id: number, dto): Observable<any> {
    return this.http.put<any>(
      '/api/gameType',
      Object.assign({}, dto, { id }),
    ).pipe(
      take(1),
    );
  }
}

