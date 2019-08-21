import { Injectable } from '@angular/core'; 
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
@Injectable() 
export class JwtInterceptor implements HttpInterceptor { 
    
    constructor(private authenticationService: AuthService) { 

    } 
    //Цепляет токен в ваши запросы
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 

        const currentUser = this.authenticationService.currentUserValue; 
        //Если есть юзер с токеном
        const isLoggedIn = currentUser && currentUser.token; 
        //Если есть адрес апи
        const isApiUrl = request.url.startsWith(environment.apiUrl); 
        if (isLoggedIn && isApiUrl) { 
            //Цепляет на запрос токен Авторизации
            request = request.clone({ setHeaders: { Authorization: `Bearer ${currentUser.token}` } }); 
        } 
        return next.handle(request); 
    } 
}