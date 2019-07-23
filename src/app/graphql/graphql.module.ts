import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
// Apollo
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { environment } from 'src/environments/environment';

const uri = 'http://localhost:4000/';

export function provideApollo(httpLink: HttpLink): any {
  const basic = setContext((op, ctx) => ({
    headers: new HttpHeaders().set('Accept', 'charset=uf-8')
  }));

  let auth: ApolloLink;

  if (localStorage.getItem('token')) {
    auth = setContext((operation, ctx) => {
      const headers = ctx.headers
        .append('public-key', environment.publicKey)
        .append(
          'authorization',
          JSON.parse(localStorage.getItem('token')).value
        );

      return {
        headers
      };
    });
  } else {
    auth = setContext((operation, ctx) => ({
      headers: ctx.headers.append('public-key', environment.publicKey)
    }));
  }

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);

  return {
    link,
    cache: new InMemoryCache(),
    dataIdFromObject: object => object.id
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
  // providers: [
  //   {
  //     provide: APOLLO_OPTIONS,
  //     useFactory: provideApollo,
  //     deps: [HttpLink]
  //   }
  // ]
})
export class GraphQLModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.api });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      // const headers = new HttpHeaders();
      // headers.set('public-key', environment.publicKey);
      // if (localStorage.getItem('token')) {
      //   headers.set('authorization', localStorage.getItem('token'));
      // }
      if (localStorage.getItem('token')) {
        // Get the authentication token from local storage if it exists
        const token = JSON.parse(localStorage.getItem('token'))['value'];
        operation.setContext({
          headers: {
            Authorization: token || ''
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

    apollo.create({
      link: concat(authMiddleware, http),
      cache: new InMemoryCache({
        dataIdFromObject: object => object.id
      })
    });
  }
}
