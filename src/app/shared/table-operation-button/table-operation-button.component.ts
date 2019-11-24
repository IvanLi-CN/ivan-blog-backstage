import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsyncTaskRequest} from '../../core/models/AsyncTaskRequest';
import {Subject} from 'rxjs';
import {NgStyleInterface} from 'ng-zorro-antd';

@Component({
  selector: 'app-table-operation-button',
  templateUrl: './table-operation-button.component.html',
  styleUrls: ['./table-operation-button.component.styl']
})
export class TableOperationButtonComponent implements OnInit, OnChanges {
  isSpinning = false;
  asyncTaskRequest: Subject<{ status: 'success' | 'failed' | 'retrying' }>;
  @Output() doTask = new EventEmitter<AsyncTaskRequest>();
  @Input() type: 'delete' = null;
  @Input() isDisabled = false;
  style: NgStyleInterface = {};

  constructor() {
  }

  ngOnInit() {

  }

  click() {
    this.isSpinning = true;
    this.asyncTaskRequest = new Subject<{ status: 'success' | 'failed' | 'retrying' }>();
    this.asyncTaskRequest
      .subscribe(
        v => {
          switch (v.status) {
            case 'success':
              this.isSpinning = false;
              break;
            case 'failed':
              this.isSpinning = false;
              break;
            case 'retrying':
              break;

          }
        },
        error => {
          this.isSpinning = false;
          console.error(error);
        },
        () => {
          this.isSpinning = false;
        }
      );
    this.doTask.emit({
      controlSubject: this.asyncTaskRequest
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type) {
      switch (changes.type.currentValue) {
        case 'delete':
          this.style.color = 'red';
          break;
        default:
          this.style.color = 'yellow';
      }
    }
  }
}
