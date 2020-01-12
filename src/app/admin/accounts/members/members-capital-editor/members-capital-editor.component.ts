import { Component } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {switchMap, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {MembersService} from '../members.service';
import {ActiveStatusesService} from '../../../../core/enums/active-statuses.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-members-capital-editor',
  templateUrl: './members-capital-editor.component.html',
  styleUrls: ['./members-capital-editor.component.scss']
})
export class MembersCapitalEditorComponent extends BaseEditorComponent<any> {
  readonly  modalWidth = '600'
  readonly dataForm = this.fb.group({
    remark: [null],
    agentId: [null],
    membersLevel: [null]
  });

  readonly modifyModalTitle: string = '资金';
  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    public activeStatusesService: ActiveStatusesService,
    private membersService: MembersService,
  ) {
    super(fb, message, route, router, modalService);
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.membersService.fetchOne(listItem.id);
  }
}

