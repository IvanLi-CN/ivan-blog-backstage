import {Directive, HostListener, Input, Optional} from '@angular/core';
import {Params, Router} from '@angular/router';
import {AsyncTaskRequest} from '../core/models/AsyncTaskRequest';

@Directive({
  selector: '[appNav2page]'
})
export class Nav2pageDirective {

  @Input()
  irQueryParams: Params;
  @Input()
  irCommands: any[];

  constructor(
    protected router: Router,
  ) {
  }

  @HostListener('click') onClick() {
    if (!this.irCommands) {
      console.warn('目标地址未配置');
      return;
    }
    this.router.navigate(
      this.irCommands,
      {queryParams: this.irQueryParams},
    );
  }

  @HostListener('doTask') doTask(task: AsyncTaskRequest) {
    console.log('doTask');
    if (!this.irCommands) {
      console.warn('目标地址未配置');
      return;
    }
    this.router.navigate(
      this.irCommands,
      {queryParams: this.irQueryParams},
    ).then(() => {
      // tslint:disable-next-line:no-unused-expression
      task && task.controlSubject.next({status: 'success'});
      // tslint:disable-next-line:no-unused-expression
      task && task.controlSubject.complete();
    }).catch(err => {
      // tslint:disable-next-line:no-unused-expression
      task && task.controlSubject.error(err);
    });
  }
}
