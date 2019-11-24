import { Injectable } from '@angular/core';
import {BaseApiService} from '../../../core/services/base-api.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberLoginBlacklistService extends BaseApiService {
  readonly apiPath = '/api/userBlackList';
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }
}
