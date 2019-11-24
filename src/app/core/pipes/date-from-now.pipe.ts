import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fromNow',
})
export class DateFromNowPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    const date = moment(value);
    const now = moment();
    if (args === 'isSame') {
      if (now.isSame(date, 'day')) {
        return date.format('HH:mm:ss')
      } else if (now.isSame(date, 'week')) {
        return date.format('dddd HH:mm');
      } else if (now.isSame(date, 'year')) {
        return date.format('MM月DD日 HH:mm');
      } else {
        return date.format('YYYY年MM月DD日 HH:mm');
      }
    } else if (args === 'simple') {
      if (now.isSame(date, 'hour')) {
        return date.fromNow();
      } else if (now.isSame(date, 'day')) {
        return date.format('HH:mm:ss');
      } else {
        return date.format('YYYY/MM/DD');
      }
    } else {
      return date.fromNow();
    }
  }
}
