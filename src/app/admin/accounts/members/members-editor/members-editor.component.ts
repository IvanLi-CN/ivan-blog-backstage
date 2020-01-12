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
import {MembersService} from '../members.service';
import {UserLevelsService} from '../user-levels.service';

@Component({
  selector: 'app-members-editor',
  templateUrl: './members-editor.component.html',
  styleUrls: ['./members-editor.component.scss']
})
export class MembersEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly modalWidth = '600';
  readonly passwordControl = this.fb.control(null, [whileRequiredValidator(() => this.isCreated), Validators.minLength(6)]);
  readonly paidPasswordControl = this.fb.control(null, [whileRequiredValidator(() => this.isCreated), Validators.minLength(6)]);
  readonly agentControl = this.fb.control(null);
  readonly dataForm = this.fb.group({
    hierarchyId: [null, [Validators.required]],
    username: [null, [Validators.required]],
    nick: [null, [Validators.required]],
    password: this.passwordControl,
    confirmPassword: [null, CustomValidators.equalTo(this.passwordControl)],
    paidPassword: this.paidPasswordControl,
    confirmPaidPassword: [null, CustomValidators.equalTo(this.paidPasswordControl)],
    isActive: [null, [Validators.required]],
    realName: [null, []],
    QQ: [null],
    email: [null, [Validators.email]],
    bankAccount: [null],
    bankSubName: [null],
    areaCode: [null],
    remark: [null],
    parentId: this.agentControl,
    level: [null, [Validators.required]]
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private membersService: MembersService,
    public  userLevelsService: UserLevelsService,
  ) {
    super(fb, message, route, router, modalService);
  }

  formatterPercent = (value: number) => `${value} %`;

  parserPercent = (value: string) => value.replace(' %', '');

  ngOnInit() {
    this.isCreated$.subscribe(isCreated => {
      if (isCreated) {
        this.dataForm.controls.username.enable();
        this.agentControl.enable();
      } else {
        this.dataForm.controls.username.disable();
        this.agentControl.disable();
      }
    });
    this.oldData$.subscribe(item => {
      this.dataForm.controls.confirmPaidPassword.setValue(item.paidPassword);
    });
  }

  protected getBaseData(): any {
    const tmp = {...super.getBaseData()};
    tmp.type = UserTypes.player;
    return tmp;
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.membersService.fetchOne(listItem.id);
  }
}
