import { HttpClientModule, HttpHeaders } from "@angular/common/http";
import { NgModule } from "@angular/core";
// Apollo
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink, HttpLinkModule } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { environment } from "src/environments/environment";

const uri = "http://localhost:4000/";

export function provideApollo(httpLink: HttpLink) {
  const basic = setContext((op, ctx) => ({
    headers: new HttpHeaders().set("Accept", "charset=uf-8")
  }));

  const auth = setContext((operation, ctx) => ({
    headers: ctx.headers.append("public-key", environment.publicKey)
  }));

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);

  return {
    link,
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
