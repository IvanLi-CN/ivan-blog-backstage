import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncTaskRequest} from '../../core/models/AsyncTaskRequest';

@Component({
  selector: 'app-table-operation-text-input-modal',
  templateUrl: './table-operation-text-input-modal.component.html',
  styleUrls: ['./table-operation-text-input-modal.component.styl']
})
export class TableOperationTextInputModalComponent implements OnInit {
  isVisible: boolean;
  @Input()
  title: string;
  @Input()
  oldValue: string;
  @Output()
  submit = new EventEmitter<{ value: string, asyncTaskRequest: AsyncTaskRequest }>();

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit($event: { value: string, asyncTaskRequest: AsyncTaskRequest }) {
    this.submit.emit($event);
  }

  doTask(localAsyncTaskRequest: AsyncTaskRequest) {
    this.isVisible = true;
    localAsyncTaskRequest.controlSubject.complete();
  }
}
