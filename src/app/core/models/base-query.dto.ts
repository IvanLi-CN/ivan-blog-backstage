import {ToBoolean} from 'class-sanitizer';

export class BaseQueryDto {
  pageSize?: number;
  pageIndex?: number;
  createdAt?: [Date, Date];
  otherField?: string;
  otherValue?: string | number | boolean;
  @ToBoolean(true)
  isActive?: boolean;

  constructor() {
    this.pageSize = 10;
    this.pageIndex = 1;
  }
}
