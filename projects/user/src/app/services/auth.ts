import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../component/login/login';
import { UserLogin, UserRegister } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}
  login(data: UserLogin): Observable<Login> {
    return this.http.post<Login>('https://crud-tasks-projects-lw3v.vercel.app/auth/login', data);
  }
  logout() {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  registerForm(data: UserRegister): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/createAccount', data);
  }
}
