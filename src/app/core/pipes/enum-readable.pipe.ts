import { Pipe, PipeTransform } from '@angular/core';
import {getLabelOfEnumValue} from '../decorators/enum-value-summary';

@Pipe({
  name: 'enumReadable'
})
export class EnumReadablePipe implements PipeTransform {

  transform(value: any, enumObj: object): any {
    return getLabelOfEnumValue(enumObj, value);
  }

}
