import { Injectable } from '@angular/core';
import { EnumService } from '../services/enum.service';
import { IoCardTypes } from './io-card-types.enum';

@Injectable({
  providedIn: 'root'
})
export class IOCardTypesService extends EnumService<IoCardTypes> {

  constructor() {
    super();
  }

  readonly listOfEnum = [
    {value: IoCardTypes.in, label: '入款卡'},
    {value: IoCardTypes.mid, label: '中转卡'},
    {value: IoCardTypes.out, label: '出款卡'},
  ];
}
