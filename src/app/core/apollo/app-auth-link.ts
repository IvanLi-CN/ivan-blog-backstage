import {ApolloLink, FetchResult, NextLink, Observable, Operation} from 'apollo-link';
import * as debug from 'debug';
import {AuthService} from '../../auth/auth.service';
import {Injector} from '@angular/core';

const log = debug('ivan:auth:link');

export class AppAuthLink extends ApolloLink {
  constructor(
    private readonly $injector: Injector,
  ) {
    super();
  }

  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      log('curr access token: %s', accessToken);
      operation.setContext(() => ({
        headers: {
          Authorization: 'Bearer ' + accessToken,
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
        this.setAccessToken(token);
      } else {
        log('server response a wrong access token: %s', authorization);
      }
      return fetchResult;
    });
  }

  private setAccessToken(token: string): void {
    this.$injector.get(AuthService).updateAccessToken(token);
  }

  private getAccessToken(): string {
    console.log(this.$injector.get(AuthService));
    return this.$injector.get(AuthService).getAccessToken();
  }
}
