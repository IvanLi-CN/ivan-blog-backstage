import {Injectable} from '@angular/core';
import {BaseApiService} from '../../../core/services/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {QueryPlatformsDto} from './query-platforms.dto';
import {map, pluck, take} from 'rxjs/operators';
import {BaseListDto} from '../../../core/models/base-list.dto';

@Injectable({
  providedIn: 'root'
})
export class PlatformListService extends BaseApiService<QueryPlatformsDto> {
  readonly apiPath = '/api/playStation';

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  fetchGameRages4User(id: number): Observable<Array<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/playStation/gameList',
      {params: this.convertQueryDtoToHttpParams({id})}
    ).pipe(
      take(1),
      map(dto => ({
        ...dto,
        rows: dto.rows.map(item => this.convertResDto(item)),
      })),
      pluck('rows'),
    );
  }

  batchModifyGameRate(dto: {rate: number, userId: number, gameId: number}[]): Observable<any> {
    return this.http.put<any>(
      '/api/playStation/setUpRate',
      {
        rateInfo: dto,
      },
    ).pipe(
      take(1),
    );
  }
}
