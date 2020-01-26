import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArticleIndexComponent} from './article-index.component';
import {ArticlePublisherComponent} from './article-publisher/article-publisher.component';
import {ArticleEditorComponent} from './article-editor/article-editor.component';

const routes: Routes = [
  {path: '', component: ArticleIndexComponent},
  {
    path: 'publish', component: ArticlePublisherComponent,
  },
  {path: ':id/editor/:part', component: ArticleEditorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {
}
