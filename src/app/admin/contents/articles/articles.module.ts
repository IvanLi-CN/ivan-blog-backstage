import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleIndexComponent } from './article-index.component';
import {SharedModule} from '../../../shared/shared.module';
import { ArticlePublisherComponent } from './article-publisher/article-publisher.component';
import { ArticleInfoEditorComponent } from './article-info-editor/article-info-editor.component';
import { ArticleContentEditorComponent } from './article-content-editor/article-content-editor.component';
import {EditorModule} from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [ArticleIndexComponent, ArticlePublisherComponent, ArticleInfoEditorComponent, ArticleContentEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
    EditorModule,
  ]
})
export class ArticlesModule { }
