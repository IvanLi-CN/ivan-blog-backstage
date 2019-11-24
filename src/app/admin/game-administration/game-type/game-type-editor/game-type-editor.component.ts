import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {Observable} from 'rxjs';
import {GameTypeService} from '../game-type.service';
import {map, switchMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-game-type-editor',
  templateUrl: './game-type-editor.component.html',
  styleUrls: ['./game-type-editor.component.scss']
})
export class GameTypeEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly dataForm = this.fb.group({
    gameTypeName: [null, [Validators.required]],
    isDisplayOnTitlebar: [null, [Validators.required]],
    priority: [null],
  });
  //readonly createdModalTitle: string = '游戏类别新增';
  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    private gameTypeService: GameTypeService,
  ) {
    super(fb, message, route, router, modalService);
  }

  ngOnInit() {
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.gameTypeService.fetchOne(listItem.id).pipe(
      map(item => ({
        ...item,
        isDisplayOnTitlebar: !!item.isDisplayOnTitlebar
      }))
    );
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.gameTypeService.create(data);
  }
  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.gameTypeService.modify(this.getDataId(oldData), data))
    );
  }
}
