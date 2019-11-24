import {Injectable} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {ActiveStatuses} from './active-statuses.enum';
import {UserTypes} from './user-types.enum';

@Injectable({
  providedIn: 'root'
})
export class IntervalMonthsService extends EnumService<number> {

  public readonly listOfEnum = [
    {value: 1, label: '月结'},
    {value: 3, label: '季结'},
    {value: 6, label: '半年结'},
    {value: 12, label: '一年结'},
  ];

  constructor() {
    super();
  }
}
