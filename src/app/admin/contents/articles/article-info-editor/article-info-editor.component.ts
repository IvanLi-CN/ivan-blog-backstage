import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-article-info-editor',
  templateUrl: './article-info-editor.component.html',
  styleUrls: ['./article-info-editor.component.scss']
})
export class ArticleInfoEditorComponent {

  readonly dataForm = this.fb.group({
    title: [null, [Validators.required]],
    slug: [null, [Validators.required]],
    authorId: [null, [Validators.required]],
    publishedAt: [null, [Validators.required]],
    isPublic: [null, [Validators.required]],
  });

  constructor(
    protected readonly fb: FormBuilder,
  ) {
  }

}
