import {Injectable} from '@angular/core';
import {EnumService} from '../services/enum.service';
import {ActiveStatuses} from './active-statuses.enum';

@Injectable({
  providedIn: 'root'
})
export class KefuWorkStatusesService extends EnumService<ActiveStatuses> {

  public readonly listOfEnum = [
    {value: true, label: '上班中'},
    {value: false, label: '已下班'},
  ];

  constructor() {
    super();
  }
}
