import {AbstractControl, ValidatorFn} from '@angular/forms';

export function GTEValidator(referencedControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (+control.value !== Number.NaN && +referencedControl.value !== Number.NaN) {
      if (+control.value < +referencedControl.value) {
        return {
          gte: {
            value: control.value,
            ref: referencedControl.value,
            msg: `不得小于${referencedControl.value}`,
          }
        };
      }
    }
    return null;
  };
}
