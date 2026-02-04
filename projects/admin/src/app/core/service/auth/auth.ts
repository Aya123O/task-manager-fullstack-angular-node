import { Injectable } from '@angular/core';
import { Login } from '../../../models/admin.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}
  login(data: Login): Observable<Login> {
    return this.http.post<Login>('http://localhost:8080/auth/login', data);
  }
  logout() {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
