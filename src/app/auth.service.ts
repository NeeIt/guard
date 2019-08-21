import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "./helpers/model/User";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  //Отправляем запрос на авторизацию
  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, {username,password})
      .pipe(
        map(user => {
          if (user && user.token) {
            //Если нам вернули пользователя, то пихаем его в кэш
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        })
      );
  }
  //Удаляем из кэша себя
  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
