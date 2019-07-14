import { Injectable } from "@angular/core";

@Injectable()
export class TokenStorageService {
  constructor() {}

  private hasExpired(key: string) {
    const token = localStorage.getItem(key);
    if (!token) {
      return true;
    }

    const data = JSON.parse(token);
    return new Date().getTime() > data.timestamp;
  }

  public saveToken(
    key: string,
    token: any,
    isLocal: any,
    expirationMin: number
  ) {
    const expirationMS = expirationMin * 60 * 1000;
    const data = {
      value: token,
      isLocal,
      timestamp: new Date().getTime() + expirationMS
    };
    localStorage.setItem(key, JSON.stringify(data));
    return token;
  }

  public getToken(key: string) {
    if (this.hasExpired(key)) {
      return null;
    }

    return JSON.parse(localStorage.getItem(key));
  }
}
