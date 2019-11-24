import {Injectable} from '@angular/core';
import {BaseApiService} from '../../../core/services/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerAgentsService extends BaseApiService {
  protected readonly apiPath = '/api/users/playerAgentList';

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  fetchOne(userId: number): Observable<any> {
    return this.http.get<any>(
      `/api/users/getInfo`,
      {params: this.convertQueryDtoToHttpParams({userId})}
    ).pipe(
      take(1),
      map(data => this.convertResDto(data)),
      map(data => ({
        ...data,
        areaCode: data.areaCode && data.areaCode.split(','),
      })),
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(
      '/api/users',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
    );
  }

  create(dto): Observable<any> {
    return this.http.post<any>(
      '/api/users',
      dto,
    ).pipe(
      take(1),
    );
  }

  modify(id: number, dto): Observable<any> {
    return this.http.put<any>(
      '/api/users',
      Object.assign({}, dto, {userId: id}),
    ).pipe(
      take(1),
    );
  }

  modifyRate(id: number, rate): Observable<any> {
    return this.http.put<any>(
      '/api/users/rate',
      Object.assign({}, {rate}, {userId: id}),
    ).pipe(
      take(1),
    );
  }
}
