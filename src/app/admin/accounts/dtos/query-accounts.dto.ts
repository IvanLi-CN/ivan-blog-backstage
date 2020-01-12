import {BaseQueryDto} from '../../../core/models/base-query.dto';

export class QueryAccountsDto extends BaseQueryDto {
  nick?: string;
  account?: string;
}
