import {Component, OnInit} from '@angular/core';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {MemberLoginBlacklistService} from '../member-login-blacklist.service';
import {ipAddrValidator} from '../../../../shared/form-validators/ip-addr-validator.directive';
import {multipleValidator} from '../../../../shared/form-validators/multiple-validator.directive';
import {whileRequiredValidator} from '../../../../shared/form-validators/while-required-validator.directive';
import {notWhiteSpace} from '../../../../shared/form-validators/not-white-space.directive';

@Component({
  selector: 'app-member-blacklist-editor',
  templateUrl: './member-blacklist-editor.component.html',
  styleUrls: ['./member-blacklist-editor.component.scss']
})
export class MemberBlacklistEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly dataForm = this.fb.group({
    ipAddressStr: [null, [whileRequiredValidator(() => this.isCreated), notWhiteSpace(), multipleValidator(ipAddrValidator())]],
    ipAddress: [null, [whileRequiredValidator(() => !this.isCreated), notWhiteSpace(), ipAddrValidator()]],
    comments: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private memberLoginBlacklistService: MemberLoginBlacklistService,
  ) {
    super(fb, message, route, router, modalService);
  }

  ngOnInit() {
  }
  protected getBaseData(): any {
    const tmp = {...super.getBaseData()};
    if (this.isCreated) {
      if (tmp.ipAddressStr) {
        tmp.ips = tmp.ipAddressStr.split('\n').map(item => item.trim()).filter(item => !!item);
      } else {
        tmp.ips = [];
      }
    }
    delete tmp.ipAddressStr;
    return tmp;
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.memberLoginBlacklistService.fetchOne(listItem.id);
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.memberLoginBlacklistService.create(data);
  }

  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.memberLoginBlacklistService.modify(this.getDataId(oldData), data))
    );
  }
}
