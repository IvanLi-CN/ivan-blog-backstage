import {BaseQueryDto} from '../../../../core/models/base-query.dto';
import {ToBoolean} from 'class-sanitizer';

export class QueryArticlesDto extends BaseQueryDto {
  slug?: string;
  title?: string;
  @ToBoolean(true)
  isPublic?: boolean;
}
