import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { AllTasks } from './component/tasks/all-tasks/all-tasks';
import { Register } from './component/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'tasks/all-tasks', component: AllTasks },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '/login' },
];
