import {UploadFile} from 'ng-zorro-antd';

export interface UploadImage extends UploadFile {
  uid: string;
  size: number;
  name: string;
  filename?: string;
  url?: string;
  type: string;
  [key: string]: any;
}
