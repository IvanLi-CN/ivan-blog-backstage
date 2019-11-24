import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseListDto } from 'src/app/core/models/base-list.dto';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SimpleSearchMemberService extends BaseApiService<any>{

  constructor(
    public http: HttpClient
  ) {
    super(http);
  }

  fetchList(queryDto: any): Observable<BaseListDto<any>> {
    return this.http.get<BaseListDto<any>>(
      '/api/users/getSimplePlayerList',
      { params: this.convertQueryDtoToHttpParams(queryDto) }
    ).pipe(
      take(1),
    );
  }
}
