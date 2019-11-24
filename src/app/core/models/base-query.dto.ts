export class BaseQueryDto {
  take?: number;
  skip?: number;
  baseDateRange?: [Date, Date];
  startAt?: string | Date;
  endAt?: string | Date;
  otherField?: string;
  otherValue?: string | number | boolean;
  isActive?: boolean;

  constructor() {
    this.take = 10;
    this.skip = 0;
  }
}
