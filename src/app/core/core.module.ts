import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BaseUrlInterceptor} from './http-client/base-url.interceptor';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UnPackInterceptor} from './http-client/un-pack.interceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AmountReadablePipe } from './pipes/amount-readable.pipe';
import { DateFromNowPipe } from './pipes/date-from-now.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { DevicePipe } from './pipes/device.pipe';
import {GraphQLModule} from '../graphql.module';

const PIPES = [
  AmountReadablePipe,
  DateFromNowPipe,
  SafePipe,
  DevicePipe
];

@NgModule({
  declarations: [...PIPES],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: BaseUrlInterceptor,
  //     multi: true,
  //   },
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: UnPackInterceptor,
  //     multi: true,
  //   },
  // ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    ...PIPES,
  ]
})
export class CoreModule {
}
