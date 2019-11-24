import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {map, switchMap, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {Observable} from 'rxjs';
import {GameListService} from '../game-list.service';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-game-list-editor',
  templateUrl: './game-list-editor.component.html',
  styleUrls: ['./game-list-editor.component.scss']
})
export class GameListEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly dataForm = this.fb.group({
    username: [null],
    gameName: [null, [Validators.required]],
    gameUrl: [null, [Validators.required]],
    imageUrl: [null, [Validators.required]],
    playStationId: [null],
    gameTypeId: [null],
    isActive: [null , [Validators.required]],
    priority: [null],
    // startBackWater: [null],
    // endBackWater: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private gameListService: GameListService,
  ) {
    super(fb, message, route, router, modalService);
  }

  ngOnInit() {
  }

  protected getBaseData(): any {
    return {
      ...this.dataForm.value,
      // startBackWater: Decimal.div(this.dataForm.value.startBackWater || 0, 100).toNumber(),
      // endBackWater: Decimal.div(this.dataForm.value.endBackWater || 0, 100).toNumber(),
    };
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.gameListService.fetchOne(listItem.id).pipe(
      map(value => ({
        ...value,
        // startBackWater: Decimal.mul(value.startBackWater || 0, 100).toNumber(),
        // endBackWater: Decimal.mul(value.endBackWater || 0, 100).toNumber(),
      })),
    );
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.gameListService.create(data);
  }

  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.gameListService.modify(this.getDataId(oldData), data)),
    );
  }
}

