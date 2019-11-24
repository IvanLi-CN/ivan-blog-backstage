import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiUtils} from './api.utils';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {NotLoggedException} from '../exceptions/not-logged.exception';

@Injectable()
export class UnPackInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private router: Router,
    ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqC = req.clone({
      headers: req.headers.delete('silence'),
    });
    return next.handle(reqC).pipe(
      map(event => {
        if (event instanceof HttpResponse && req.responseType === 'json') {
          event = event.clone({body: ApiUtils.unPack(event)});
        }
        return event;
      }),
      catchError(err => {
        if (req.responseType === 'json') {
          if ([404].includes(err.status)) {
            this.message.error('资源未找到');
            return throwError(err).pipe();
          }
          if (err instanceof NotLoggedException || [401, 403].includes(err.code) || [401, 403].includes(err.body.code)) {
            this.router.navigate(['/auth/login']);
          }
        }
        if (req.headers.get('silence') === 'client' || req.headers.get('silence') === 'both') {
          return throwError(err).pipe();
        }
        if (typeof err.message !== 'object') {
          this.message.error('服务器消息：' + err.message);
        }
        return throwError(err).pipe();
      })

      );
  }
}
