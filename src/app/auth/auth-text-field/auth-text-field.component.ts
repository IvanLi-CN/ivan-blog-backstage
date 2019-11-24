import {Component, DoCheck, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, FormControlName, NgControl} from '@angular/forms';

@Component({
  selector: 'app-auth-text-field',
  templateUrl: './auth-text-field.component.html',
  styleUrls: ['./auth-text-field.component.scss']
})
export class AuthTextFieldComponent implements OnInit, DoCheck, ControlValueAccessor {
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

  // tslint:disable-next-line:no-input-rename
  @Input('value')
  val: string;
  isFocus = false;
  error: string;
  control: FormControl;

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
  }

  focus() {
    this.isFocus = true;
  }

  blur() {
    this.isFocus = false;
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
    if (this.ngControl.dirty) {
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
