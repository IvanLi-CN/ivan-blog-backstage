import { Injectable } from '@angular/core';
import { EnumService } from '../services/enum.service';
import { DepositAndWithdrawalTypes } from './deposit-and-withdrawal-types.enum';

@Injectable({
  providedIn: 'root'
})
export class DepositAndWithdrawalTypesService extends EnumService<DepositAndWithdrawalTypes> {

  constructor() {
    super();
  }

  readonly listOfEnum = [
    { value: DepositAndWithdrawalTypes.artificialDeposit, label: '人工存款', operationalType: 'in', extraValid: ['multiple'] },
    { value: DepositAndWithdrawalTypes.otherDeposit, label: '其他存款', operationalType: 'in', extraValid: ['multiple'] },
    { value: DepositAndWithdrawalTypes.cancelPaymentout, label: '取消出款', operationalType: 'in' },
    { value: DepositAndWithdrawalTypes.preferentialSupplement, label: '优惠补充', operationalType: 'in', extraValid: ['multiple'] },
    { value: DepositAndWithdrawalTypes.clearNegative, label: '负数清零', operationalType: 'in' },
    { value: DepositAndWithdrawalTypes.otherPlatformPay, label: '三方充值', operationalType: 'in', notEditor: true, },
    { value: DepositAndWithdrawalTypes.artificialPaymentout, label: '人工出款', operationalType: 'out' },
    { value: DepositAndWithdrawalTypes.otherPaymentout, label: '其他出款', operationalType: 'out' },
    { value: DepositAndWithdrawalTypes.cancelDeposit, label: '取消入款', operationalType: 'out' },
    { value: DepositAndWithdrawalTypes.cancelDiscount, label: '取消优惠', operationalType: 'out' },
    { value: DepositAndWithdrawalTypes.recharge, label: '充值' },
    { value: DepositAndWithdrawalTypes.withdraw, label: '提现' },
  ];

  getFilterDataByoperationalType(type = 'in', notEditor = false) {
    return this.listOfEnum.filter(f => {
      if (notEditor && f.notEditor) {
        return false;
      }
      return f.operationalType === type;
    });
  }
}
