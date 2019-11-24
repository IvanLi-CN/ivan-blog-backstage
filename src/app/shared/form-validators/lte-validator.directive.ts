import {AbstractControl, ValidatorFn} from '@angular/forms';

export function LTEValidator(referencedControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (+control.value !== Number.NaN && +referencedControl.value !== Number.NaN) {
      if (+control.value > +referencedControl.value) {
        return {
          lte: {
            value: control.value,
            ref: referencedControl.value,
            msg: `不得大于${referencedControl.value}`,
          }
        };
      }
    }
    return null;
  };
}
