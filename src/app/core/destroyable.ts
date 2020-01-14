import {filter, share, switchMap, takeUntil} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable, Subject} from 'rxjs';
import * as debug from 'debug';

const log = debug('ivan:base:destroyable');
export class Destroyable {

  public readonly destroying$: Observable<void>;
  public readonly destroyed$: Observable<void>;
  private readonly destroyingSubject = new Subject<void>();
  private readonly destroyedSubject = new Subject<void>();

  constructor() {
    this.destroyed$ = this.getDestroyed$();
    this.destroying$ = this.getDestroying$();
    this.watchDestroy();
  }

  protected destroy() {
    this.destroyedSubject.next();
  }

  private getDestroying$() {
    return this.destroyingSubject.pipe(
      takeUntil(this.destroyed$),
      share(),
    );
  }

  private getDestroyed$() {
    return this.destroyedSubject.pipe(share());
  }

  private watchDestroy() {
    this.destroying$.pipe(
      takeUntil(this.destroyed$),
      switchMap(() => fromPromise(this.isAllowDestroy())),
      filter(value => value),
    ).subscribe(() => {
      this.destroyedSubject.next();
    });
  }

  protected async isAllowDestroy(): Promise<boolean> {
    log('allow destroy');
    return true;
  }
}
