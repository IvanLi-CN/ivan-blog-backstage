import {ApolloLink, FetchResult, NextLink, Operation} from 'apollo-link';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

export class AppAuthLink extends ApolloLink {
  protected authToken = null;
  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    operation.setContext(({ headers }) => ({ headers: {
        authorization: this.authToken,
        ...headers
      }}));
    const observer = forward(operation);
    const context = operation.getContext();
    console.log('context', context);
    return observer;
  }
}
