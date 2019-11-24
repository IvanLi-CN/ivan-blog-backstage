import {HttpResponse} from '@angular/common/http';
import {ApiException} from '../exceptions/api.exception';
import {NotLoggedException} from '../exceptions/not-logged.exception';

export class ApiUtils {
  static unPack(response: HttpResponse<any>) {
    console.log(response);
    if (response.status < 200 || response.status > 299) {
      throw new ApiException(response);
    }
    if (typeof response.body !== 'object') {
      throw new ApiException(response);
    }
    if (response.body.hasOwnProperty('error')) {
      if ([401, 403].includes(response.body.error)) {
        throw new NotLoggedException(response);
      }
      if (![200, 201, 204].includes(response.body.code)) {
        throw new ApiException(response);
      }
    } else {
      throw new ApiException(response);
    }

    return response.body.data;
  }
}
