import {Injectable} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {ActiveStatuses} from './active-statuses.enum';

@Injectable({
  providedIn: 'root'
})
export class ActiveStatusesService extends EnumService<ActiveStatuses> {

  public readonly listOfEnum = [
    {value: true, label: '启用'},
    {value: false, label: '禁用'},
  ];

  constructor() {
    super();
  }
}
