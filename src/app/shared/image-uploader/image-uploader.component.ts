import {Component, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {NzMessageService, UploadChangeParam, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {ControlValueAccessor, FormControlName, NgControl} from '@angular/forms';
import {iif, Observable, of, ReplaySubject, Subscription} from 'rxjs';
import {debounceTime, flatMap, switchMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private valueSubscription: Subscription;
  get value() {
    return this.val;
  }

  set value(val) {
    const isFirst = !this.value;
    this.val = val;
    if (!isFirst) {
      this.onTouched();
    }
    this.onChange(this.value);
    this.valueSubject.next(this.value);
  }

  readonly valueSubject = new ReplaySubject<string>(1);
  readonly value$: Observable<string> = this.valueSubject;

  constructor(
    private message: NzMessageService,
    private http: HttpClient,
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private controlName: FormControlName,
    private sanitizer: DomSanitizer,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    this.valueSubscription = this.value$.pipe(
      debounceTime(100),
      switchMap(path => iif(
        () => !path,
        of(),
        this.http.get(`${location.origin}/${path}`, {responseType: 'blob'}).pipe(
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
        )
      ))
    ).subscribe(url => {
      this.imageUrl = url;
    });
  }
  private val: string = null;
  imageUrl: string = null;
  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => /^image/.test(w.type));
        if (filterFiles.length !== fileList.length) {
          this.message.error(`包含文件格式不正确，只支持图片上传`);
          return filterFiles;
        }
        return fileList;
      }
    },
  ];
  loading = false;
  customReq = (({file, action, data, name, onProgress, onSuccess, onError}: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append(name, file as unknown as Blob);
    const req = new HttpRequest('POST', `/api/images/${action}`, formData, {
      reportProgress: true,
      withCredentials: true
    });
    return this.http.request(req).subscribe(
      (event: HttpEvent<{}>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total > 0) {
            (event as any).percent = (event.loaded / event.total) * 100;
          }
          onProgress(event, file);
        } else if (event instanceof HttpResponse) {
          onSuccess(event.body, file, event);
        }
      },
      err => {
        onError(err, file);
      }
    );
  });
  isDisabled: boolean;
  beforeUpload = ((file: UploadFile, fileList: UploadFile[]) => new Observable(observable => {
    this.onTouched();
    observable.next(true);
    observable.complete();
  }));
  onChange: (value: string) => void = (() => {});
  onTouched: () => void = (() => {});

  ngOnInit() {
  }

  private async getBase64(img: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result.toString()));
      reader.readAsDataURL(img);
    });
  }

  async uploadChange({type, file, fileList, event}: UploadChangeParam) {
    switch (file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.imageUrl = await this.getBase64(file.originFileObj);
        this.loading = false;
        this.value = file.response.path;
        break;
      case 'error':
        this.message.warning('图片上传失败！');
        this.loading = false;
        break;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line:no-unused-expression
    this.valueSubscription && this.valueSubscription.unsubscribe();
  }
}
