import {BaseListDto} from './models/base-list.dto';
import {BaseQueryDto} from './models/base-query.dto';
import {Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncTaskRequest} from './models/AsyncTaskRequest';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {BaseTableComponent} from './base-table.component';

export class BaseModalIndexComponent<
  QueryDto extends BaseQueryDto = BaseQueryDto, ListItem = any, ListDto extends BaseListDto<ListItem> = BaseListDto<ListItem>
  > extends BaseTableComponent<QueryDto, ListItem, ListDto> implements OnInit, OnDestroy {
  protected modalWidth = '500px';
  protected modal: NzModalRef<unknown>;
  protected modalTitle: string;
  @ViewChild('tplContent', {static: false})
  private readonly tplContent;

  get listItem(): ListItem {
    return this._listItem;
  }
  @Input()
  set listItem(value: ListItem) {
    this._listItem = value;
    this.listItemSubject.next(this.listItem);
  }
  // tslint:disable-next-line:variable-name
  private _listItem: ListItem;
  private listItemSubject = new ReplaySubject<ListItem>(1);
  listItem$: Observable<ListItem> = this.listItemSubject;
  ngOnInit(): void {}

  constructor(
    protected fb: FormBuilder,
    protected message: NzMessageService,
    public route: ActivatedRoute,
    public router: Router,
    protected modalService: NzModalService,
  ) {
    super(fb, message);
  }

  public async openDialog(asyncTaskRequest: AsyncTaskRequest = null, tplContent = this.tplContent) {
    this.initialize();
    this.modal = this.modalService.create({
      nzTitle: this.modalTitle,
      nzContent: tplContent,
      nzFooter: null,
      nzMaskClosable: true,
      nzClosable: false,
      nzWidth: this.modalWidth,
    });
    this.modal.afterClose.subscribe(() => {
      this.destroy();
    });
    // tslint:disable-next-line:no-unused-expression
    asyncTaskRequest && asyncTaskRequest.controlSubject.next({status: 'success'});
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line:no-unused-expression
    this.modal && this.modal.close();
  }
}
