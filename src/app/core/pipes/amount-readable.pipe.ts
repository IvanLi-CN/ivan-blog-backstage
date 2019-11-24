import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'decimal.js';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'amountReadable'
})
export class AmountReadablePipe implements PipeTransform {
  number = new DecimalPipe('zh');
  transform(value: any, ...args: any[]): any {
    const amount = new Decimal(value);
    if (amount.abs().gte(new Decimal(100000000))) {
      return `${this.number.transform(amount.div(new Decimal(100000000)).toNumber(), '1.0-2')}亿`;
    }
    if (amount.abs().gte(new Decimal(10000))) {
      return `${this.number.transform(amount.div(new Decimal(10000)).toNumber(), '1.0-2')}万`;
    }
    return this.number.transform(amount.toNumber(), ...args);
  }

}
