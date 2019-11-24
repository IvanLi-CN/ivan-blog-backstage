import {Component, OnInit} from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {whileRequiredValidator} from '../../../../shared/form-validators/while-required-validator.directive';
import {FormBuilder, Validators} from '@angular/forms';
import {UserTypes} from '../../../../core/enums/user-types.enum';
import {CustomValidators} from 'ngx-custom-validators';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {PlayerAgentsService} from '../player-agents.service';

@Component({
  selector: 'app-player-agent-editor',
  templateUrl: './player-agent-editor.component.html',
  styleUrls: ['./player-agent-editor.component.scss']
})
export class PlayerAgentEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly passwordControl = this.fb.control(null, [whileRequiredValidator(() => this.isCreated), Validators.minLength(6)]);
  defaultData = {type: UserTypes.playerAgent};
  readonly agentControl = this.fb.control(null);
  readonly dataForm = this.fb.group({
    username: [null, [Validators.required]],
    nick: [null, [Validators.required]],
    password: this.passwordControl,
    confirmPassword: [null, CustomValidators.equalTo(this.passwordControl)],
    isActive: [null, [Validators.required]],
    realName: [null, []],
    QQ: [null, []],
    email: [null, [Validators.email]],
    bankAccount: [null, []],
    bankSubName: [null, []],
    areaCode: [null, []],
    remark: [null],
    parentId: this.agentControl,
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private playerAgentsService: PlayerAgentsService,
  ) {
    super(fb, message, route, router, modalService);
  }

  ngOnInit(): void {
    this.isCreated$.subscribe(isCreated => {
      if (isCreated) {
        this.dataForm.controls.username.enable();
        this.agentControl.enable();
      } else {
        this.dataForm.controls.username.disable();
        this.agentControl.disable();
      }
    });
  }

  formatterPercent = (value: number) => `${value} %`;

  parserPercent = (value: string) => value.replace(' %', '');

  protected getBaseData(): any {
    const tmp = {...super.getBaseData()};
    tmp.type = UserTypes.playerAgent;
    return tmp;
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.playerAgentsService.fetchOne(listItem.id);
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.playerAgentsService.create(data);
  }

  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.playerAgentsService.modify(this.getDataId(oldData), data))
    );
  }
}
