import { Component, OnInit } from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {Article} from '../article.model';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-article-content-editor',
  templateUrl: './article-content-editor.component.html',
  styleUrls: ['./article-content-editor.component.scss']
})
export class ArticleContentEditorComponent {
  public readonly contentCtl = this.fb.control(null, [Validators.required]);

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly message: NzMessageService,
  ) {
  }

}
