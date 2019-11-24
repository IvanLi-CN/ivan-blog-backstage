import {AbstractControl, ValidatorFn} from '@angular/forms';

export function notWhiteSpace(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (control.value !== null && !control.value.trim()) {
      return {
        notWhite: {
          value: control.value,
          msg: '不得为空',
        }
      };
    }
    return null;
  };
}

