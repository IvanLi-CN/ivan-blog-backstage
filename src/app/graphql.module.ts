import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import { onError } from 'apollo-link-error';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {AppAuthLink} from './core/apollo/app-auth-link';

const uri = 'api/graphql'; // <-- add the URL of the GraphQL server here


export function createApollo(httpLink: HttpLink, router: Router, nzMessage: NzMessageService) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const graphQLError of graphQLErrors) {
        if (graphQLError.message) {
          nzMessage.warning(graphQLError.message);
        }
        if (graphQLError.extensions.code === '401') {
          router.navigate(['auth/login']).then();
        }
      }
      graphQLErrors.map(({ message, locations, path, extensions }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }

    if (networkError) { console.log(`[Network error]: ${networkError}`); }
  });
  return {
    link: ApolloLink.from([
      errorLink,
      new AppAuthLink(),
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
      deps: [HttpLink, Router, NzMessageService],
    },
  ],
})
export class GraphQLModule {}
