import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanReadable'
})
export class BooleanReadablePipe implements PipeTransform {

  transform(value: boolean, trulyText = 'True', falsyText = 'False', otherText = '--'): any {
    if (value === true) {
      return trulyText;
    }
    if (value === false) {
      return falsyText;
    }
    return otherText;
  }

}
