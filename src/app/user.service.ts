import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './helpers/model/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAll(){
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
  getById(id:number){
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }
  delete(id:number){
    return this.http.delete<User>(`${environment.apiUrl}/users/${id}`);
  }
}
