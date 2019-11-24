import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthTextFieldComponent } from './auth-text-field/auth-text-field.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthInputFieldComponent } from './auth-input-field/auth-input-field.component';
import { AuthImageCaptchaTextFieldComponent } from './auth-image-captcha-text-field/auth-image-captcha-text-field.component';
import {CoreModule} from '../core/core.module';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LoginComponent, AuthTextFieldComponent, AuthInputFieldComponent, AuthImageCaptchaTextFieldComponent, LogoutComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ]
})
export class AuthModule { }
