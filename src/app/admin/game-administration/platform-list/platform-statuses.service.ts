import { Injectable } from '@angular/core';
import {EnumService} from '../../../core/services/enum.service';
import {ActiveStatuses} from '../../../core/enums/active-statuses.enum';
import {PlatformStatuses} from './platform-statuses.enum';

@Injectable({
  providedIn: 'root'
})
export class PlatformStatusesService extends EnumService<ActiveStatuses> {

  public readonly listOfEnum = [
    {value: PlatformStatuses.最新, label: '最新'},
    {value: PlatformStatuses.最热, label: '最热'},
    {value: PlatformStatuses.火爆, label: '火爆'},
    {value: PlatformStatuses.普通, label: '普通'},
  ];

  constructor() {
    super();
  }
}
