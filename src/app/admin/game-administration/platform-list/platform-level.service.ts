import { Injectable } from '@angular/core';
import {EnumService} from '../../../core/services/enum.service';
import {ActiveStatuses} from '../../../core/enums/active-statuses.enum';
import {PlatformLevel} from './platform-level.enum';

@Injectable({
  providedIn: 'root'
})
export class PlatformLevelService extends EnumService<ActiveStatuses> {

  public readonly listOfEnum = [
    {value: PlatformLevel.五星, label: '五星'},
    {value: PlatformLevel.四星, label: '四星'},
    {value: PlatformLevel.三星, label: '三星'},
    {value: PlatformLevel.两星, label: '两星'},
    {value: PlatformLevel.一星, label: '一星'},
  ];

  constructor() {
    super();
  }
}

