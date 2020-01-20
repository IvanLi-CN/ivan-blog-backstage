import {Component} from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {FormBuilder, Validators} from '@angular/forms';
import {UserTypes} from '../../../../core/enums/user-types.enum';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';
import {switchMap, take, tap} from 'rxjs/operators';
import {HierarchiesService} from '../hierarchies.service';
import {LTEValidator} from '../../../../shared/form-validators/lte-validator.directive';

@Component({
  selector: 'app-hierarchy-editor',
  templateUrl: './hierarchy-editor.component.html',
  styleUrls: ['./hierarchy-editor.component.scss']
})
export class HierarchyEditorComponent extends BaseEditorComponent<any> {
  readonly upperLimitOfPaymentCtl = this.fb.control(null, [Validators.required]);
  defaultData = {type: UserTypes.company};
  readonly dataForm = this.fb.group({
    name: [null, [Validators.required]],
    description: [null, []],
    maxBetAmount: [null, [Validators.required]],
    upperLimitOfPayment: this.upperLimitOfPaymentCtl,
    lowerLimitOfPayment: [null, [Validators.required, LTEValidator(this.upperLimitOfPaymentCtl)]],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private hierarchiesService: HierarchiesService
  ) {
    super(fb, message, route, router);
  }

  formatterPercent = (value: number) => `${value} %`;

  parserPercent = (value: string) => value.replace(' %', '');

  protected fetchOldData(listItem: any): Observable<any> {
    return this.hierarchiesService.fetchOne(listItem.id);
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.hierarchiesService.create(data).pipe(tap(value => {
      this.listItem = value;
    }));
  }

  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.hierarchiesService.modify(this.getDataId(oldData), data))
    );
  }
}
