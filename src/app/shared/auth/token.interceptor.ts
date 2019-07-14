import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public injector: Injector) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const sessionService = this.injector.get(SessionService);
    // if (sessionService.isSignedIn()) {
    //   request = request.clone({
    //     setHeaders: {
    //       authorization: sessionService.isSignedIn().token,
    //       'public-key': environment.publicKey
    //     }
    //   });
    // }
    return next.handle(request);
  }
}
