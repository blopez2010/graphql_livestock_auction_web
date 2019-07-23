import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { environment } from '../environments/environment';

@NgModule({
  exports: [ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.api });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      const headers = new HttpHeaders();
      headers.set('public-key', environment.publicKey);
      if (localStorage.getItem('token')) {
        headers.set('authorization', localStorage.getItem('token'));
      }
      operation.setContext({
        ...headers
      });

      return forward(operation);
    });

    apollo.create({
      link: concat(authMiddleware, http),
      cache: new InMemoryCache()
    });
  }
}
