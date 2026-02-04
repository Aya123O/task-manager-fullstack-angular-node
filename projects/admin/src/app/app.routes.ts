import { DashboardAdmin } from './component/dashboard-admin/dashboard-admin';
import { Routes } from '@angular/router';
import { Login } from './component/auth/login/login';
import { ListTasks } from './component/tasks/list-tasks/list-tasks';
import { AddTask } from './component/tasks/add-task/add-task';
import { Users } from './component/users/users';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'add-task', component: AddTask, canActivate: [authGuard] },

  { path: 'tasks/all-tasks', component: ListTasks, canActivate: [authGuard] },
  { path: 'users', component: Users, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: DashboardAdmin },
  { path: '**', redirectTo: '' },
];
