import {BaseQueryDto} from '../../../core/models/base-query.dto';

export class QueryPlatformsDto extends BaseQueryDto{
  companyId?: number;
  platform?: string;
  platformLevel?: string;
  platformStatus?: string;
}
