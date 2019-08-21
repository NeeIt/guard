import { Injectable } from "@angular/core";
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService,private router:Router) {}

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    //Если ошибка 401 или 403, то перезагрузка, иначе передаст ошибку дальше
    return next.handle(request).pipe(
      catchError(err => {
        if ([401].indexOf(err.status) !== -1) {
          this.authenticationService.logout();
          location.reload(true);
        }
        if ([403].indexOf(err.status) !== -1) {
         console.log('403');
        }
        const error = err//.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
