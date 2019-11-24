import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'device'
})
export class DevicePipe implements PipeTransform {

  transform(userAgent: any): any {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent)) {
      return 'mobile';
    } else {
      return 'computer';
    }
  }

}
