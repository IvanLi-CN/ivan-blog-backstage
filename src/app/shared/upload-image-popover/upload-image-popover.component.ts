import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {UploadImage} from './upload-image.interface';

@Component({
  selector: 'app-upload-image-popover',
  templateUrl: './upload-image-popover.component.html',
  styleUrls: ['./upload-image-popover.component.scss']
})
export class UploadImagePopoverComponent implements OnInit {

  constructor(
    public message: NzMessageService
  ) {
  }

  public get images(): string {
    return this.localImage;
  }

  public set images(val: string) {
    if (val) {
      this.images = val;
    }
  }

  get previewImage2(): string | undefined {
    return this.previewImage && location.origin + '/' + this.previewImage;
  }
  @Input() title = '图片预览';
  @Input() trigger = 'click';
  @Input() imageCounts = 3;
  @Output() uploadHandle = new EventEmitter();
  @Input() fileList: UploadImage[] = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;
  loading = false;

  localImage = '';

  handlePreview = ((file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  });

  handleRemove = ((file) => {
    console.log(file);
    _.remove(this.fileList, f => {
      return f.uid === file.uid;
    });
    this.uploadHandle.emit(this.fileList);
    return true;
  });

  ngOnInit() {
  }

  handleChange(info: { file: UploadFile, fileList: any[] }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        const files: UploadImage[] = info.fileList.map(m => {
          return {
            uid: m.uid,
            name: m.name,
            status: m.status,
            size: m.size,
            type: m.type,
            url: m.url || m.response.path,
          };
        });
        this.uploadHandle.emit(files);
        break;
      case 'error':
        this.message.error('Network error');
        this.loading = false;
        break;
    }
  }


}
