import {Injector, NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {onError} from 'apollo-link-error';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {AppAuthLink} from '../apollo/app-auth-link';
import * as debug from 'debug';

const uri = 'api/graphql'; // <-- add the URL of the GraphQL server here

const log = debug('ivan:graphql');


export function createApollo(httpLink: HttpLink, router: Router, nzMessage: NzMessageService, $injector: Injector) {
  const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      for (const graphQLError of graphQLErrors) {
        if (graphQLError.message) {
          nzMessage.warning(graphQLError.message);
        }
        if (graphQLError.extensions.code === '401') {
          router.navigate(['auth/login']).then();
        }
      }
      graphQLErrors.map(error =>
        log(
          `error: %O`,
          error,
        ),
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  return {
    link: ApolloLink.from([
      errorLink,
      new AppAuthLink($injector),
      httpLink.create({uri}),
    ]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Router, NzMessageService, Injector],
    },
  ],
})
export class GraphQLModule {
}
