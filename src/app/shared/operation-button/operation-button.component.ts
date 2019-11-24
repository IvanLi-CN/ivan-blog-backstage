import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {AsyncTaskRequest} from '../../core/models/AsyncTaskRequest';

@Component({
  selector: 'app-operation-button',
  templateUrl: './operation-button.component.html',
  styleUrls: ['./operation-button.component.styl']
})
export class OperationButtonComponent implements OnInit {
  @Input() type: 'normal' | 'delete' | 'primary' | 'confirm' = 'normal';
  @Input() isDisabled = false;
  @Output() doTask = new EventEmitter<AsyncTaskRequest>();
  asyncTaskRequest: Subject<{ status: 'success' | 'failed' | 'retrying' }>;
  isLoading = false;

  constructor() { }

  ngOnInit() {
  }

  handleDo() {
    this.isLoading = true;
    this.asyncTaskRequest = new Subject<{ status: 'success' | 'failed' | 'retrying' }>();
    this.asyncTaskRequest
      .subscribe(
        v => {
          switch (v.status) {
            case 'success':
              this.isLoading = false;
              break;
            case 'failed':
              break;
            case 'retrying':
              break;

          }
        },
        error => {
          this.isLoading = false;
          console.error(error);
        },
        () => {
          this.isLoading = false;
        }
      );
    this.doTask.emit({
      controlSubject: this.asyncTaskRequest
    });
  }
}
