import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BaseQueryDto} from '../models/base-query.dto';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {BaseListDto} from '../models/base-list.dto';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService<QueryDto extends BaseQueryDto = BaseQueryDto> {
  protected readonly apiPath: string;
  constructor(
    protected http: HttpClient,
  ) {

  }
  convertQueryDtoToHttpParams(dto: BaseQueryDto | {[params: string]: any}, isPagination = false) {
    const keys = Object.keys(dto);
    let params = new HttpParams();
    keys.forEach(key => {
      const value = dto[key];
      if (value === undefined || value === null) {
        return;
      }
      if (Array.isArray(value)) {
        return value.forEach(item => {
          params = params.append(key, item);
        });
      }
      if (typeof value === 'string' && value.trim() === '') {
        return;
      }
      if (value instanceof Date || moment.isMoment(value)) {
        return params = params.set(key, moment(value).toISOString());
      }
      params = params.set(key, dto[key].toString().trim());
    });
    if (isPagination) {
      if (!params.has('take')) {
        params = params.set('take', '15');
      }
      if (!params.has('skip')) {
        params = params.set('skip', '0');
      }
    }
    return params;
  }
  fetchList(queryDto: QueryDto): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      this.apiPath,
      {params: this.convertQueryDtoToHttpParams(queryDto)}
    ).pipe(
      take(1),
      map(dto => ({
        ...dto,
        records: dto.rows.map(item => this.convertResDto(item)),
      }))
    );
  }

  fetchOne(id: number): Observable<any> {
    return this.http.get<any>(
      this.apiPath,
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
      map(dto => dto.rows[0]),
      map(data => this.convertResDto(data))
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(
      this.apiPath,
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
    );
  }

  create(dto): Observable<any> {
    return this.http.post<any>(
      this.apiPath,
      dto,
    ).pipe(
      take(1),
    );
  }

  modify(id: number, dto: any): Observable<any> {
    return this.http.put<any>(
      this.apiPath,
      Object.assign({}, dto, {id}),
    ).pipe(
      take(1),
    );
  }

  convertResDto(dto) {
    if (!dto) {
      return null;
    }
    const tmp = {...dto};
    if (tmp.hasOwnProperty('isActive')) {
      tmp.isActive = !!tmp.isActive;
    }
    return tmp;
  }

  batchModify(ids: number[], dto: any): Observable<any> {
    return this.http.put<any>(
      this.apiPath,
      Object.assign({}, dto, {ids}),
    ).pipe(
      take(1)
    );
  }
}
