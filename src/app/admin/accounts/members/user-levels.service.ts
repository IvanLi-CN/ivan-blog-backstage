import {Injectable} from '@angular/core';
import {EnumService} from '../../../core/services/enum.service';
import {UserLevels} from './user-levels.enum';

@Injectable({
  providedIn: 'root'
})
export class UserLevelsService extends EnumService<UserLevels> {

  constructor() {
    super();
  }

  readonly listOfEnum = [
    {value: UserLevels.general, label: '普通'},
    {value: UserLevels.safe, label: '危险'},
    {value: UserLevels.dangerous, label: '安全'},
  ];
}
