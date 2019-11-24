import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {AsyncTaskRequest} from '../../core/models/AsyncTaskRequest';


@Component({
  selector: 'app-text-input-modal',
  templateUrl: './text-input-modal.component.html',
  styleUrls: ['./text-input-modal.component.styl']
})
export class TextInputModalComponent implements OnInit, OnChanges {

  @Input()
  isVisible = false;
  @Output()
  isVisibleChange = new EventEmitter<boolean>();
  @Input()
  oldValue: string = null;
  @Input()
  title: any;
  @Output()
  submit = new EventEmitter<{value: string, asyncTaskRequest: AsyncTaskRequest}>();

  value: string;
  isOkLoading: boolean;

  constructor() { }

  ngOnInit() {
  }

  handleOk(): void {
    this.isOkLoading = true;
    const controlSubject = new Subject<{status: 'success' | 'failed' | 'retrying'}>();
    controlSubject.subscribe({
      complete: () => {
        this.isVisible = false;
        this.isOkLoading = false;
        this.isVisibleChange.emit(false);
      },
      error: () => {
        this.isOkLoading = false;
      }
    });
    const asyncTaskRequest: AsyncTaskRequest = {
      controlSubject,
    };
    this.submit.emit({value: this.value, asyncTaskRequest});
  }

  handleCancel(): void {
    this.isVisibleChange.emit(false);
    this.isVisible = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    Object.keys(changes).forEach(key => {
      if (key === 'oldValue') {
        this.value = changes.oldValue.currentValue as unknown as string;
      }
    });
  }

  onVisibleChange($event: boolean) {
    this.isVisible = $event;
    this.isVisibleChange.emit($event);
  }
}
