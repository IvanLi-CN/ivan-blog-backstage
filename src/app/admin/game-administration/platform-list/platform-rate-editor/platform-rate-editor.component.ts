import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {filter, map, switchMap, toArray} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {from, Observable, of} from 'rxjs';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {PlatformListService} from '../platform-list.service';
import Decimal from 'decimal.js';
import {AsyncTaskRequest} from '../../../../core/models/AsyncTaskRequest';

@Component({
  selector: 'app-platform-rate-editor',
  templateUrl: './platform-rate-editor.component.html',
  styleUrls: ['./platform-rate-editor.component.scss']
})
export class PlatformRateEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly dataForm = this.fb.group({
    platform: [null, [Validators.required]],
  });
  readonly modifyModalTitle: string = '费率设置';
  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private platformListService: PlatformListService,
  ) {
    super(fb, message, route, router, modalService);
  }
  gameRate4CurrUser$ = this.listItem$.pipe(
    filter(listItem => !!listItem),
    switchMap(listItem => this.platformListService.fetchGameRages4User(listItem.id)),
  );
  gameRates$ = this.gameRate4CurrUser$.pipe(
    switchMap((currUser) => from(currUser).pipe(
      map(gameRate => {
        gameRate.rateViewValue = Decimal.mul(
          Decimal.max(gameRate.rate || 0, (Decimal.add(gameRate.parentRate || 0, 0.01))),
          100).toNumber();
        return gameRate;
      }),
      toArray()
    ))
  );
  gameRates: any[];

  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');

  ngOnInit() {
  }

  async openDialog(asyncTaskRequest: AsyncTaskRequest = null, tplContent = this.tplContent): Promise<void> {
    this.gameRates$.subscribe(value => this.gameRates = value);
    super.openDialog();
    // tslint:disable-next-line:no-unused-expression
    asyncTaskRequest && asyncTaskRequest.controlSubject.next({status: 'success'});
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return of({});
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.platformListService.create(data);
  }

  async submitForm($event): Promise<void> {
    this.platformListService.batchModifyGameRate(this.gameRates.map(item => ({
      id: item.id,
      gameId: item.gameId,
      userId: item.userId,
      rate: Decimal.div(item.rateViewValue, 100).toNumber(),
    }))).subscribe(() => {
        this.message.success('修改成功！');
        this.modal.destroy();
      },
      (err) => {
        if (!err.message) {
          this.message.info('修改失败！');
        } else if (typeof err.message !== 'object') {
          this.message.info(`修改失败！原因：${err.message}`);
        } else {
          this.message.info('修改失败！');
        }
      }
    );
  }
}
