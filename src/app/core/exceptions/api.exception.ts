import {AppException} from './app-exception';
import {HttpResponse} from '@angular/common/http';

export class ApiException extends AppException {
  constructor(response: HttpResponse<any>) {
    if (response.status < 200 || response.status > 299) {
      if (typeof response.body !== 'object') {
        super('服务器响应异常');
      } else if (response.body.msg) {
        super(response.body.msg);
      } else if (response.body.message) {
        super(response.body.message);
      } else {
        super('服务器异常');
      }
    } else if (![200, 201, 204].includes(response.body.code)) {
      if (response.body.msg) {
        super(response.body.msg);
      } else if (response.body.message) {
        super(response.body.message);
      } else {
        super(JSON.stringify(response.body));
      }
    }
    Object.assign(this, response);
  }
}
