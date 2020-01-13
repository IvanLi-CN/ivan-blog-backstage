import { Component, OnInit } from '@angular/core';
import {BaseIndexComponent} from '../../../core/base-index.component';
import {Article} from './article.model';
import {QueryArticlesDto} from './dtos/query-articles.dto';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticlesService} from './articles.service';
import {AsyncTaskRequest} from '../../../core/models/AsyncTaskRequest';
import {fromPromise} from 'rxjs/internal-compatibility';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseListDto} from '../../../core/models/base-list.dto';

@Component({
  selector: 'app-article-index',
  templateUrl: './article-index.component.html',
  styleUrls: ['./article-index.component.scss']
})
export class ArticleIndexComponent extends BaseIndexComponent<QueryArticlesDto, Article> {

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public articlesService: ArticlesService,
  ) {
    super(fb, message, route, router);
  }

  protected getFetchListObservable(conditions: QueryArticlesDto): Observable<BaseListDto<Article>> {
    return this.articlesService.getArticles(conditions);
  }

  createArticle($event: AsyncTaskRequest) {
    from(this.router.navigate(['./publish'], { relativeTo: this.route })).pipe(
      map(result => {
        if (result) {
          return;
        } else {
          throw new Error('navigate failed');
        }
      })
      ).subscribe(
      () => $event.controlSubject.next({status: 'success'}),
      () => $event.controlSubject.next({status: 'failed'}),
    );
  }
}
