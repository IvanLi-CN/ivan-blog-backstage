import { Injectable } from '@angular/core';
import { EnumService } from '../services/enum.service';
import { IoPaymentTypes } from './io-payment-types.enum';

@Injectable({
  providedIn: 'root'
})
export class IoPaymentTypesService extends EnumService<IoPaymentTypes> {

  constructor() {
    super();
  }

  readonly listOfEnum = [
    { value: IoPaymentTypes.in, label: '入款' },
    { value: IoPaymentTypes.out, label: '出款' },
  ];
}
