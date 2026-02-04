import { UserService } from './../../../core/service/users/user.service';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Task } from '../../../core/service/tasks/task';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddTask } from '../add-task/add-task';
import { CommonModule } from '@angular/common';
import { TaskData } from '../../../models/task.interface';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';
import { MatLabel, MatFormField } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../models/user.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip'; // Add this

@Component({
  selector: 'app-list-tasks',
  imports: [
    MatTooltipModule,
    MatButtonModule,
    CommonModule,
    NgxSpinnerComponent,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatLabel,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxPaginationModule,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  templateUrl: './list-tasks.html',
  styleUrl: './list-tasks.css',
})
export class ListTasks implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'img',
    'title',
    'user',
    'description',
    'deadline',
    'status',
    'actions',
  ];
  tasks = signal<TaskData[]>([]);
  filters$ = new Subject<{
    keyword?: string;
    userId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }>();
  dateFilters = { fromDate: null as string | null, toDate: null as string | null };
  paginatedTasks = signal<TaskData[]>([]);
  destroy$ = new Subject<void>();
  filiterArr: any = {};
  statusOptions: any = [];
  users: User[] = [];
  page = 1; // current page
  pageSize = 5;
  constructor(
    private Task: Task,
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService,
  ) {
    this.statusOptions = [{ name: 'Pending' }, { name: 'In-Progress' }, { name: 'completed' }];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.filters$
      .pipe(
        debounceTime(300),
        switchMap((filters) => {
          this.filiterArr = { ...this.filiterArr, ...filters };
          // this.spinner.show();
          return this.Task.getAllTasks(this.filiterArr);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (data: any) => {
          // this.spinner.hide();
          this.tasks.set(this.mappingTasks(data.tasks));
          this.updatePaginatedTasks();
        },
        error: () => {
          this.spinner.hide();
          this.toastr.error('Failed to load tasks');
        },
      });
    this.filters$.next({});
    this.getAllUsers();
  }

  // Pagination method
  updatePaginatedTasks(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks.set(this.tasks().slice(startIndex, endIndex));
  }

  // Filter methods with page reset
  search(event: HTMLInputElement) {
    this.page = 1;
    this.filters$.next({ keyword: event.value });
  }

  selectUser(event: any) {
    this.page = 1;
    this.filters$.next({ userId: event.value });
  }

  userstatus(event: any) {
    this.page = 1;
    this.filters$.next({ status: event.value });
  }

  selectDate(event: any, type: 'fromDate' | 'toDate') {
    const selectedDate = moment(event.value).format('DD-MM-YYYY');
    this.dateFilters[type] = selectedDate;
    this.page = 1;

    if (this.dateFilters.fromDate && this.dateFilters.toDate) {
      this.filters$.next({ ...this.filiterArr, ...this.dateFilters });
    }
  }

  addTask() {
    let dialogRef = this.dialog.open(AddTask, {
      height: '620px',
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.page = 1;
        this.filters$.next({ ...this.filiterArr });
      }
    });
  }

  deleteTask(id: string) {
    // this.spinner.show();
    this.Task.deleteTask(id).subscribe({
      next: (res) => {
        // this.spinner.hide();
        this.toastr.success('Task Deleted successfully');
        this.page = 1;
        this.filters$.next({ ...this.filiterArr });
      },
    });
  }

  editTask(task: TaskData) {
    let dialogRef = this.dialog.open(AddTask, {
      height: '620px',
      width: '500px',
      data: task,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.page = 1;
        this.filters$.next({ ...this.filiterArr });
      }
    });
  }

  mappingTasks(data: TaskData[]) {
    let newTask = data.map((item) => {
      console.log(item);
      return {
        ...item,
        image: `http://localhost:8080/${item.image.replace(/\\/g, '/')}`,
        user: item.userId?.username,
      };
    });
    return newTask;
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.users;
      console.log(res.users);
    });
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePaginatedTasks();
  }

  // Method to calculate total pages
  getTotalPages(): number {
    return Math.ceil(this.tasks().length / this.pageSize);
  }

  // Optional: Add page number buttons
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.page - 2);
      let end = Math.min(totalPages, start + maxPagesToShow - 1);

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
