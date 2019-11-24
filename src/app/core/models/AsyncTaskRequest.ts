import {Subject} from 'rxjs';

export class AsyncTaskRequest {
  controlSubject: Subject<{status: 'success' | 'failed' | 'retrying'}>;
}
