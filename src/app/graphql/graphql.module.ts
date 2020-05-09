import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
// Apollo
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { environment } from '../../environments/environment';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.api });

    const ws = new WebSocketLink({ uri: environment.wsLink, options: { reconnect: true } });

    const authMiddleware = new ApolloLink((operation, forward) => {
      if (localStorage.getItem('token')) {
        // Get the authentication token from local storage if it exists
        const token = JSON.parse(localStorage.getItem('token'))['value'];
        operation.setContext({
          headers: {
            'auth-lsa': token || '',
            'public-key': environment.publicKey
          }
        });
      } else {
        operation.setContext({
          headers: {
            'public-key': environment.publicKey
          }
        });
      }

      return forward(operation);
    });
    
    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      ws,
      concat(authMiddleware, http)
    );

    apollo.create({
      // link: concat(authMiddleware, http),
      link,
      cache: new InMemoryCache({
        dataIdFromObject: (object) => object.id
      }),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
    });
  }
}
