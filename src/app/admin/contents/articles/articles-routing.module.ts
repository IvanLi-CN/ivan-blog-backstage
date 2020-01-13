import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArticleIndexComponent} from './article-index.component';
import {ArticlePublisherComponent} from './article-publisher/article-publisher.component';
import {ArticleInfoEditorComponent} from './article-info-editor/article-info-editor.component';
import {ArticleContentEditorComponent} from './article-content-editor/article-content-editor.component';

const routes: Routes = [
  {path: '', component: ArticleIndexComponent},
  {
    path: 'publish', component: ArticlePublisherComponent, children: [
      {path: 'base-info/:id?', component: ArticleInfoEditorComponent},
      {path: 'content/:id?', component: ArticleContentEditorComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {
}
