import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createTask } from '../../../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class Task {
  constructor(private http: HttpClient) {}
  getAllTasks(filiter: any) {
    let params = new HttpParams();
    Object.entries(filiter).forEach(([key, value]:any) => {
      if (value) {
      params = params.append(key, value);
    }
    });

    return this.http.get('https://crud-tasks-projects-lw3v.vercel.app/tasks/all-tasks', { params });
  }
  createTask(task: any) {
    return this.http.post('http://localhost:8080/tasks/add-task', task);
  }
  deleteTask(id: string) {
    return this.http.delete(`http://localhost:8080/tasks/delete-task/${id}`);
  }
  editTask(task: any, id: string) {
    return this.http.put(`http://localhost:8080/tasks/edit-task/${id}`, task);
  }
}
