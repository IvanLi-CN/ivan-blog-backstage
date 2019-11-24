import { Injectable } from '@angular/core';
import { EnumService } from '../services/enum.service';
import { IoCardTypes } from './io-card-types.enum';
import { PayType } from './pay-type.enum';

@Injectable({
  providedIn: 'root'
})
export class PayTypeService extends EnumService<PayType> {

  constructor() {
    super();
  }

  readonly listOfEnum = [
    {value: PayType.bank, label: '银行入款'},
    {value: PayType.wechat, label: '微信'},
    {value: PayType.alipay, label: '支付宝'},
    {value: PayType.yfs, label: '云闪付'},
    {value: PayType.tenpay, label: '财付通'},
    {value: PayType.jd, label: '京东'},
    {value: PayType.other, label: '其他'},
  ];
}
