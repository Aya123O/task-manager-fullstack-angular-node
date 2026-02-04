import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getAllUsers(): Observable<any> {
    return this.http.get(' http://localhost:8080/auth/users');
  }
  deleteUser(id: string) {
    return this.http.delete(`http://localhost:8080/auth/user/${id}`);
  }

  changeStatus(id: string, status: string) {
    return this.http.put(`http://localhost:8080/auth/user-status`, {
      id,
      status,
    });
  }
}
