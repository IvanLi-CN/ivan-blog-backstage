import {Component, DoCheck, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, FormControlName, FormGroup, NgControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-auth-image-captcha-text-field',
  templateUrl: './auth-image-captcha-text-field.component.html',
  styleUrls: ['./auth-image-captcha-text-field.component.scss']
})
export class AuthImageCaptchaTextFieldComponent implements OnInit, DoCheck, ControlValueAccessor {
  public errorTexts: string[] = [];

  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouched();
  }
  @Input()
  label: string;
  @Input()
  type: 'text' | 'password' = 'text';
  @Input()
  activatedIcon: string;
  @Input()
  notActivatedIcon: string;
  @Input()
  captchaImage$: Observable<string>;

  @Input('value')
  val: string;
  isFocus = false;
  error: string;
  control: FormControl;
  captchaImgUrl: string;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }
  ngOnInit() {
    this.control = this.controlName.control;
    this.fetchCaptcha();
  }

  focus() {
    this.isFocus = true;
  }

  blur() {
    this.isFocus = false;
  }

  async fetchCaptcha() {
    this.captchaImgUrl = await this.captchaImage$.pipe(take(1)).toPromise();
    this.ngControl.reset();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
  }

  ngDoCheck(): void {
    const textArr: string[] = [];
    if (this.ngControl.touched && this.ngControl.dirty) {
      // tslint:disable-next-line:forin
      for (const errorsKey in this.ngControl.errors) {
        const currError = this.ngControl.errors[errorsKey];
        switch (errorsKey) {
          case 'minlength':
            textArr.push(`长度不得小于${currError.requiredLength}个字符`);
            break;
          case 'required':
            textArr.push(`${this.label}是必填的`);
            break;
          default:
            console.log(this.ngControl.errors);
            textArr.push(JSON.stringify(currError));
        }
      }
    }
    this.errorTexts = textArr;
    // this.ngControl.errors;
  }

}

