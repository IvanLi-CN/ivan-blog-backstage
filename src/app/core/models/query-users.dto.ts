import {BaseQueryDto} from './base-query.dto';
import {UserTypes} from '../enums/user-types.enum';

export class QueryUsersDto extends BaseQueryDto {
 nick?: string;
 type?: UserTypes;
 username?: string;
 types?: UserTypes[];
}
