import {AppException} from './app-exception';
import {HttpResponse} from '@angular/common/http';

export class NotLoggedException extends AppException {
  constructor(response: HttpResponse<any>) {
    super('您尚未登录，请先登录！');
    Object.assign(this, response);
  }
}
