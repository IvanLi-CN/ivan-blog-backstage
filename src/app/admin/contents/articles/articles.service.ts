import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {QueryArticlesDto} from './dtos/query-articles.dto';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {BaseListDto} from '../../../core/models/base-list.dto';
import {Article} from './article.model';
import {map, pluck, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(
    private readonly apollo: Apollo,
  ) { }

  getArticles(queryDto: QueryArticlesDto): Observable<BaseListDto<Article>> {
    return this.apollo.watchQuery<{articles: Article[], articlesCount: number}>({
      query: gql`
        query fetchArticleList(
          $slug: String,
          $title: String,
          $isPublic: Boolean,
          $authorId: ID,
          $pageIndex: Int,
          $pageSize: Int,
        ) {
          articles(
            slug: $slug,
            title: $title,
            isPublic: $isPublic,
            authorId: $authorId,
            pageIndex: $pageIndex,
            pageSize: $pageSize,
          ) {
            id,
            title,
            slug,
            publishedAt,
            createdAt,
            isPublic,
            summary,
            author {
              id
              nick
            }
            tags {
              id,
              name,
            }
          },
          articlesCount(
            slug: $slug,
            title: $title,
            isPublic: $isPublic,
            authorId: $authorId,
          ),
        },
      `,
      variables: queryDto,
    }).valueChanges.pipe(
      pluck('data'),
      map(({articles, articlesCount}) => ({
        records: articles,
        count: articlesCount,
      })),
    );
  }

  create(createDto: Readonly<Partial<Article>>): Observable<Article> {
    return this.apollo.mutate<Article>({
      mutation: gql`
        mutation createArticle($article: CreateArticleInput!) {
          createArticle(createArticleInput: $article) {
            id,
            author {
              id,
              nick,
              account,
            },
            htmlContent,
            publishedAt,
          }
        }
      `,
      variables: { article: createDto },
    }).pipe(
      tap(console.log),
    );
  }
}
