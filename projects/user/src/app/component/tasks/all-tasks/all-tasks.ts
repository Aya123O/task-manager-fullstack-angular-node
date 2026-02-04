import { SharedService } from './../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Task } from './../../../services/task';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ListTask } from '../../list-task/list-task';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.html',
  imports: [CommonModule],
  styleUrls: ['./all-tasks.css'],
})
export class AllTasks implements OnInit {
  userData: any;
  selectTasks: string = 'In-Progress';
  completeTasks: string = 'completed';
  tasks: any[] = [];

  constructor(
    private _Task: Task,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getUserData();
    if (this.userData?.userId) {
      this.getAllTasks();
      this.getCompletedTasks();
    }
  }
  showAllCompleted: boolean = false;

  // Add this method
  toggleCompletedTasks() {
    this.showAllCompleted = !this.showAllCompleted;
  }
  getCompletedTasks() {
    if (!this.userData?.userId) return;

    this._Task.getUserTasks(this.userData.userId, 1, 10, this.completeTasks).subscribe({
      next: (res: any) => {
        this.completeTasksList = res.tasks.map((task: any) => ({
          ...task,
          image: task.image ? `http://localhost:8080/${task.image.replace(/\\/g, '/')}` : null,
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  getUserData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = token.split('.')[1];
    this.userData = JSON.parse(window.atob(payload));
    console.log('User data:', this.userData);
  }
  completeTasksList: any[] = []; // add this at the top

  completeTask(item: any) {
    let model = { id: item._id };

    this._Task.completeTask(model).subscribe({
      next: () => {
        // remove from in-progress
        this.tasks = this.tasks.filter((task) => task._id !== item._id);

        // add to completed
        this.completeTasksList.push({ ...item, status: 'completed' });
        this.getAllTasks();
        this.getCompletedTasks();

        this.sharedService.updateTask(this.tasks.length);
        this.cdr.detectChanges();

        this.toastr.success('Task Completed Successfully');
      },
      error: () => {
        this.toastr.error('Failed to complete task');
      },
    });
  }

  getAllTasks() {
    if (!this.userData?.userId) {
      console.error('User ID not found');
      return;
    }

    this._Task.getUserTasks(this.userData.userId, 1, 10, this.selectTasks).subscribe({
      next: (res: any) => {
        this.tasks = res.tasks.map((task: any) => {
          return {
            ...task,
            image: `http://localhost:8080/${task.image.replace(/\\/g, '/')}`,
          };
        });
        console.log(this.tasks);
        Promise.resolve().then(() => {
          this.sharedService.updateTask(this.tasks.length);
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('API Error:', err),
    });
  }

  viewTask(task: any) {
    let dialogRef = this.dialog.open(ListTask, {
      height: '620px',
      width: '600px',
      data: task,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
}
