import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { User } from "./model/User";
import { Role } from "./model/Role";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { mergeMap, materialize, delay, dematerialize } from "rxjs/operators";
import { ok } from "assert";

let users = JSON.parse(localStorage.getItem('users')) || [
  {
    id: 1,
    username: "admin",
    password: "admin",
    firstname: "Steve",
    lastname: "Cuber",
    role: Role.Admin
  },
  {
    id: 2,
    username: "user",
    password: "user",
    firstname: "Mike",
    lastname: "Willson",
    role: Role.User
  }
];

@Injectable()
export class FakeBackIntercaptor implements HttpInterceptor {
constructor(){

}

    //Интерцептер перехватит запрос
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Разберет запрос на составляющие
    const { url, method, headers, body } = req;
  
    //Переключается на распознание запроса
    return of(null).pipe(
      mergeMap(handleRoute),
      materialize(),
      delay(500),
      dematerialize()
    );
    
    //Если в конце запроса есть users/... и метод, то выполняет свой соответствующий метод
    function handleRoute() {
      switch (true) {

        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate();

        case url.endsWith("/users") && method === "GET":
          return getUsers();
          
          case url.endsWith('/users/register') && method === 'POST':
            return register();  

        case url.match(/\/users\/\d+$/) && method === "GET":
          return getUserById();

          case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
          
        //Если ничего не нашел, то перезает запрос дальше
        default:
          return next.handle(req);
        
      }
    }

    function authenticate() {
        //Получает из параметров логин и пароль
      const { username, password } = body;
        
        //Перебирает пользователей и возвращает пеодошедшего
      const user = users.find(
        x => x.username === username && x.password === password
      );
      //Если пользователь не найден, то возвращает ошибку
      if (!user) return error("Username or password is incorrect");
      return ok({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        token:'fake-token.'+user.id
      });
    }
    
    function register() {
      const user = body;

      if (users.find(x => x.username === user.username)) {
          return error('Username "' + user.username + '" is already taken')
      }

      user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
      
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      return ok({});
  }

  function deleteUser() {
    if (!isLogginedIn()) return unauthorized();

    users = users.filter(x => x.id !== idFromUrl());
    localStorage.setItem('users', JSON.stringify(users));
    return ok({});
}

    //Если вы не админ, то вы не получите список пользователей
    function getUsers(){    
        if(!isAdmin())return haveNotPermisions();
        return ok(users);
    }

    function getUserById(){
        if(!isLogginedIn())return unauthorized();
        //Если имеющийся id не совпадает с токеном, то не авторизован
        if(!isAdmin && currentUser().id!==idFromUrl())return haveNotPermisions();
        const user = users.find(x=>x.id!==idFromUrl());
        return ok(user);
    }
    function currentUser(){
        if(!isLogginedIn)return;
        //Берем id из токена 
        const id = parseInt(headers.get("authorization").split('.')[1])

        return users.find(x=>x.id===id);
    }


    function ok(body){
        return of(new HttpResponse({status:200,body}));
    }

    function error(message){
        return throwError({status:400,error:{message}});
    }

    function haveNotPermisions(){
      return throwError({status:403,error:{message:'have not permisions'}});
  }

    function unauthorized(){
        return throwError({status:401,error:{message:'unauthorized'}});
    }

    //Если токен есть, то мы авторизованы
    function isLogginedIn(){
        const authHeader = headers.get("authorization") || '';
        return authHeader.startsWith('Bearer fake-token.');
    }
    //Если мы авторизированы и у нас есть роль Админа, то true
    function isAdmin(){
        return isLogginedIn() && currentUser().role==Role.Admin;
    }
    //Id находится в конце faketoken2412314, так что мы разбираем url на части и возвращаем только id
    function  idFromUrl(){
   
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length-1]);
    }
  }
}
//Если идет запрос, то перехватит последним
export const fakeBackProvider={
    provide:HTTP_INTERCEPTORS,
    useClass:FakeBackIntercaptor,
    multi:true
}
