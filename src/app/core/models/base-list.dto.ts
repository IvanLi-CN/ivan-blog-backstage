export class BaseListDto<T> {
  rows: T[];
  count: number;
  [p: string]: any;
}
