import {AbstractControl, ValidatorFn} from '@angular/forms';
// tslint:disable-next-line:max-line-length
const domainValidatorRex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
export function domainValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const value = control.value.trim();
    if (!domainValidatorRex.test(value)) {
      return {
        domain: {
          value,
          msg: `${value} 不是合法的域名`,
        }
      };
    }
    return null;
  };
}
