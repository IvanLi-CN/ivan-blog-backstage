import { Injectable } from '@angular/core';
import {BaseApiService} from '../../../core/services/base-api.service';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseListDto } from 'src/app/core/models/base-list.dto';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HierarchiesService extends BaseApiService{
  readonly apiPath = '/api/hierarchy';
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  convertResDto(dto) {
    const tmp = super.convertResDto(dto);
    tmp.maxBetAmount = +tmp.maxBetAmount;
    tmp.upperLimitOfPayment = +tmp.upperLimitOfPayment;
    tmp.lowerLimitOfPayment = +tmp.lowerLimitOfPayment;
    return tmp;
  }

  fetchList(queryDto: any): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      this.apiPath,
      { params: this.convertQueryDtoToHttpParams(queryDto) }
    ).pipe(
      take(1),
    );
  }

}
