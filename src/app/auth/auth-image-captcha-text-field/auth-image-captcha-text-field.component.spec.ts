import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthImageCaptchaTextFieldComponent } from './auth-image-captcha-text-field.component';

describe('AuthImageCaptchaTextFieldComponent', () => {
  let component: AuthImageCaptchaTextFieldComponent;
  let fixture: ComponentFixture<AuthImageCaptchaTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthImageCaptchaTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthImageCaptchaTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
