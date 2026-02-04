import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Task {
  constructor(private http: HttpClient) {}
  getUserTasks(userId: string, page: number, limit: number, status?: string) {
    let url = `http://localhost:8080/tasks/user-tasks/${userId}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return this.http.get(url);
  }
  completeTask(model: object) {
    return this.http.put(' http://localhost:8080/tasks/complete',model)
  }
}
