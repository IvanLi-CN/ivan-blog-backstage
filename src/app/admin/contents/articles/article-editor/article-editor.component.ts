import { Component, OnInit } from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent extends BaseEditorComponent {

  get id() {
    return this.route.snapshot.paramMap.get('id');
  }
  get part() {
    return this.route.snapshot.paramMap.get('part');
  }

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly message: NzMessageService,
    public readonly route: ActivatedRoute,
    public readonly router: Router,
  ) {
    super(fb, message, route, router);
  }

}
