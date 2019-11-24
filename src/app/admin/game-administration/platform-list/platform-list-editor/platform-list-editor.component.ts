import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PlatformStatusesService} from '../platform-statuses.service';
import {switchMap, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatformLevelService} from '../platform-level.service';
import {BaseEditorComponent} from '../../../../core/base-editor.component';
import {Observable} from 'rxjs';
import {PlatformListService} from '../platform-list.service';

@Component({
  selector: 'app-platform-list-editor',
  templateUrl: './platform-list-editor.component.html',
  styleUrls: ['./platform-list-editor.component.scss']
})
export class PlatformListEditorComponent extends BaseEditorComponent<any> implements OnInit {
  readonly dataForm = this.fb.group({
    platform: [null, [Validators.required]],
    imageUrl: [null, [Validators.required]],
    platformLevel: [null],
    platformStatus: [null],
    OnlineNumber: [null],
    // platformUrl: [null, [Validators.required]],
    priority: [null],
    platformInstruction: [null],
  });

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NzModalService,
    private platformListService: PlatformListService,
    public platformStatusesService: PlatformStatusesService,
    public platformLevelService: PlatformLevelService,
  ) {
    super(fb, message, route, router, modalService);
  }

  ngOnInit() {
  }

  protected fetchOldData(listItem: any): Observable<any> {
    return this.platformListService.fetchOne(listItem.id);
  }

  protected onSubmitCreated(data): Observable<any> {
    return this.platformListService.create(data);
  }

  protected onSubmitModify(data): Observable<any> {
    return this.oldData$.pipe(
      take(1),
      switchMap(oldData => this.platformListService.modify(this.getDataId(oldData), data))
    );
  }
}
