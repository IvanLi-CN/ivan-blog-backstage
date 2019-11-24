import { Injectable } from '@angular/core';
import {UserStates} from './user-states.enum';
import {EnumService} from '../services/enum.service';
import {ActiveStatuses} from './active-statuses.enum';

@Injectable({
  providedIn: 'root'
})
export class UserStateService extends EnumService<ActiveStatuses> {

  public readonly listOfEnum = [
    {value: UserStates.pendingAudit, label: '未审核'},
    {value: UserStates.approved, label: '通过'},
    {value: UserStates.refused, label: '拒绝'},
  ];

  constructor() {
    super();
  }
}
