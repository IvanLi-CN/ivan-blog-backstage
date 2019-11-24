import {BaseQueryDto} from './base-query.dto';

export class QueryPermissionGroupsDto extends BaseQueryDto{
  name?: string;
  isActive?: boolean;
}
