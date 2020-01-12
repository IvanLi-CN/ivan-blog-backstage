import {Injectable} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {ActiveStatuses} from './active-statuses.enum';
import {UserTypes} from './user-types.enum';

@Injectable({
  providedIn: 'root'
})
export class UserTypesService extends EnumService<UserTypes> {

  public readonly listOfEnum = [
    {value: UserTypes.admin, label: '管理员'},
    {value: UserTypes.company, label: '公司'},
    {value: UserTypes.playerAgent, label: '会员代理'},
    {value: UserTypes.companyAgent, label: '公司代理'},
  ];

  constructor() {
    super();
  }
}
