import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, zh_CN} from 'ng-zorro-antd';
import { registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IconsProviderModule} from './icons-provider.module';
import {CustomFormsModule} from 'ngx-custom-validators';
import {SharedModule} from './shared/shared.module';
import * as moment from 'moment';

moment.locale('zh-cn');

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IconsProviderModule,
    BrowserAnimationsModule,
    SharedModule,
    CustomFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
