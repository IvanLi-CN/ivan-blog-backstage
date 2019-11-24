import {AbstractControl, ValidatorFn} from '@angular/forms';

export function multipleValidator(validatorFn: ValidatorFn, split: string = '\n'): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const strArr = (control.value as string).split(split).map(str => str.trim());
    const resultArr = strArr.map(str => validatorFn({...control, value: str} as AbstractControl));
    const errArr = resultArr.filter(rt => rt);
    console.log(strArr, resultArr);
    if (errArr.length > 0) {
      const err = {...errArr[0]};
      return {
        ...err,
      };
    }
    return null;
  };
}
