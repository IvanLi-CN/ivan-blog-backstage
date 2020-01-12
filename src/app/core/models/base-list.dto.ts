export class BaseListDto<T> {
  records: T[];
  count: number;
  total?: Partial<T> & {[p: string]: any};
  [p: string]: any;
}
