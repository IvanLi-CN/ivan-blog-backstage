import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';

export function whileRequiredValidator(flagFn: () => boolean = () => true): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (flagFn()) {
      return Validators.required(control);
    } else {
      return null;
    }
  };
}
