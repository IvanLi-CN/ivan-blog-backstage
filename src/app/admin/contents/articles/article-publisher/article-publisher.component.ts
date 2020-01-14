import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleInfoEditorComponent} from '../article-info-editor/article-info-editor.component';
import {Article} from '../article.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {ArticleContentEditorComponent} from '../article-content-editor/article-content-editor.component';
import {ArticlesService} from '../articles.service';

@Component({
  selector: 'app-article-publisher',
  templateUrl: './article-publisher.component.html',
  styleUrls: ['./article-publisher.component.scss']
})
export class ArticlePublisherComponent extends BaseEditorComponent implements OnInit, AfterViewInit {
  defaultData = Object.assign(
    new Article(),
    {publishedAt: new Date(), isPublic: true} as Partial<Article>,
  );
  @ViewChild('contentEditor', {static: false})
  contentEditor: ArticleContentEditorComponent;
  private _InfoEditor: ArticleInfoEditorComponent;

  constructor(
    protected readonly fb: FormBuilder,
    protected readonly message: NzMessageService,
    public readonly route: ActivatedRoute,
    public readonly router: Router,
    public readonly articlesService: ArticlesService,
  ) {
    super(fb, message, route, router);
  }

  get infoEditor(): ArticleInfoEditorComponent {
    return this._InfoEditor;
  }

  @ViewChild('infoEditor', {static: false})
  set infoEditor(value: ArticleInfoEditorComponent) {
    this._InfoEditor = value;
  }

  private _currStep = 0;

  private readonly currStepSubject: BehaviorSubject<number> = new BehaviorSubject(this._currStep);
  public readonly currStep$: Observable<number> = this.currStepSubject.pipe();

  get currStep(): number {
    return this._currStep;
  }

  set currStep(value: number) {
    this._currStep = value;
    this.currStepSubject.next(value);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      for (const name of Object.keys(this.infoEditor.dataForm.controls)) {
        this.dataForm.addControl(name, this.infoEditor.dataForm.get(name));
      }
      this.dataForm.addControl('htmlContent', this.contentEditor.contentCtl);
      super.ngOnInit();
    });
  }

  protected getDefaultIsCreated(): boolean {
    return true;
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.articlesService.create(data);
  }

}
