import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class SessionService {
  private readonly tokenExpirationInMinutes = 43200; // 30 days
  private readonly localStorageTokenKey = 'token';
  private readonly localStorageUserKey = 'user';
  private userLoggingIn = new Subject<boolean>();
  userLoggedIn = this.userLoggingIn.asObservable();

  constructor(
    private tokenStorage: TokenStorageService,
    private apollo: Apollo
  ) {}

  //#region Private function

  private readonly loginMutation = gql`
    mutation($user: String!, $password: String!) {
      login(input: { user: $user, password: $password }) {
        user
        token
      }
    }
  `;

  private saveTokenToLocalStorage(tokenDetails) {
    this.tokenStorage.saveToken(
      this.localStorageTokenKey,
      tokenDetails,
      true,
      this.tokenExpirationInMinutes
    );
  }

  private saveToken(token: any, keepLogged: any) {
    if (keepLogged) {
      this.saveTokenToLocalStorage(token);
      return;
    }
    this.saveTokenToSessionStorage(token);
  }

  private saveTokenToSessionStorage(tokenDetails: any) {
    this.tokenStorage.saveToken(
      this.localStorageTokenKey,
      tokenDetails,
      false,
      this.tokenExpirationInMinutes
    );
  }

  private getTokenFromLocalStorage() {
    const token = this.tokenStorage.getToken(this.localStorageTokenKey);
    if (token) {
      return token.value;
    }
    return null;
  }

  private getTokenFromSessionStorage() {
    const token = this.tokenStorage.getToken(this.localStorageTokenKey);
    if (token && !token.isLocal) {
      return token.value;
    }
    return null;
  }

  //#endregion

  //#region Public functions

  public login({ user, password }, keepLogged?: boolean) {
    this.logout();
    return this.apollo
      .mutate({
        mutation: this.loginMutation,
        variables: {
          user,
          password
        }
      })
      .pipe(
        map(result => {
          this.saveToken(result.data.login.token, keepLogged);
          return result;
        })
      );
  }

  public logout() {
    localStorage.clear();
  }

  public userHasLoggedIn(loggedIn: boolean) {
    this.userLoggingIn.next(loggedIn);
  }

  public get isLoggedIn(): boolean {
    return (
      this.getTokenFromLocalStorage() ||
      this.getTokenFromSessionStorage() ||
      null
    );
  }

  //#endregion
}
