import {Account} from '../../accounts/models/account';

export class Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  mdContent?: string;
  htmlContent?: string;
  // tags: Tag[];
  author: Account;
  authorId: number;
  publishedAt: Date;
  createdAt: Date;
  isPublic: boolean;
  // isDelete: boolean;
}
