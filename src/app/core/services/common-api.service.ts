import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BaseQueryDto} from '../models/base-query.dto';
import {flatMap} from 'rxjs/operators';
import {Observable, ReplaySubject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseApiService} from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService extends BaseApiService{
  constructor(
    protected http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    super(http);
  }
  getImageBlobUrl(path: string): Observable<string> {
    return this.http.get(`${location.origin}/${path}`, {responseType: 'blob', headers: new HttpHeaders({silence: 'client'})}).pipe(
      flatMap(image => {
        const subject = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          subject.next(this.sanitizer.bypassSecurityTrustUrl(reader.result as string) as string);
        }, false);
        if (image) {
          reader.readAsDataURL(image);
        } else {
          subject.thrownError(new Error('无法读取到图片'));
        }
        return subject;
      }),
    );
  }
}
