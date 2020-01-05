import {ApolloLink, FetchResult, NextLink, Observable, Operation} from 'apollo-link';
import * as debug from 'debug';

const log = debug('ivan:auth:link');

export class AppAuthLink extends ApolloLink {
  protected authToken = null;

  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    if (this.authToken) {
      log('curr access token: %s', this.authToken);
      operation.setContext(() => ({
        headers: {
          Authorization: 'Bearer ' + this.authToken,
        }
      }));
    }
    const observer = forward(operation);
    // const context = operation.getContext();
    // console.log('context', context);
    return observer.map(fetchResult => {
      const {response: {headers}} = operation.getContext();
      const authorization = headers.get('Authorization') as string | null;
      const [type, token] = authorization?.split(' ') ?? [];
      if (type?.toLocaleLowerCase() === 'bearer') {
        this.authToken = token;
      } else {
        log('server response a wrong access token: %s', authorization);
      }
      console.log('fetchResult', this.authToken);
      return fetchResult;
    });
  }
}
