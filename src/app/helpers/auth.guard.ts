import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  constructor(private router:Router,private authService:AuthService){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean | Observable<boolean>{
    //Получаем пользователя
    const currentUser = this.authService.currentUserValue;
    
    if( currentUser ){
      if (route.data.roles && route.data.roles.indexOf(currentUser.role)===-1){

        this.router.navigate(['/']);
        return false; //Если у него нет ни единой роли, то пошел вон
      }
      return true; //Если роль есть
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false; //Если пользователя нет
  }
}
