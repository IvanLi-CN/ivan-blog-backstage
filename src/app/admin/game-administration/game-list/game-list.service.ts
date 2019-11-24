import { Injectable } from '@angular/core';
import {map, take} from 'rxjs/operators';
import {BaseApiService} from '../../../core/services/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {QueryGameListDto} from './query-game-list.dto';

@Injectable({
  providedIn: 'root'
})
export class GameListService extends BaseApiService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  fetchList(queryDto: QueryGameListDto): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/gameList',
      {params: this.convertQueryDtoToHttpParams(queryDto)}
    ).pipe(
      take(1),
    );
  }

  fetchOne(id: number): Observable<any> {
    return this.http.get<any>(
      '/api/gameList',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
      map(dto => dto.rows[0]),
      map(dto => ({
        ...dto,
        isActive: !!dto.isActive,
      }))
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(
      '/api/gameList',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
    );
  }

  create(dto): Observable<any> {
    return this.http.post<any>(
      '/api/gameList',
      dto,
    ).pipe(
      take(1),
    );
  }
  modify(id: number, dto): Observable<any> {
    return this.http.put<any>(
      '/api/gameList',
      Object.assign({}, dto, { id }),
    ).pipe(
      take(1),
    );
  }
}
