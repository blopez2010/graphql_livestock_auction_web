import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { HttpLinkModule } from "apollo-angular-link-http";
import { GraphQLModule } from "../graphql/graphql.module";
import { SharedModule } from "../shared/shared.module";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { LoginComponent } from "./login/login.component";

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    GraphQLModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class AuthenticationModule {
  // constructor(apollo: Apollo, httpLink: HttpLink) {
  //   const http = httpLink.create({ uri: environment.api });
  //   const authMiddleware = new ApolloLink((operation, forward) => {
  //     // add the authorization to the headers
  //     operation.setContext({
  //       headers: new HttpHeaders().set('public-key', environment.publicKey)
  //     });
  //     return forward(operation);
  //   });
  //   apollo.create({
  //     link: concat(authMiddleware, http),
  //     cache: new InMemoryCache()
  //   });
  // }
}
