import { Component, OnInit } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/service/users/user.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxSpinnerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'assignedTasks', 'role', 'status', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.spinner.show();
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.dataSource.data = res.users;
        this.users = res.users;

        // Log status of each user (if needed)
        res.users.forEach((user: any) => console.log(user.status));

        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to load users');
      },
    });
  }

  deleteUser(id: string, index: number) {
    if (this.dataSource.data[index].assignedTasks > 0) {
      this.toastr.error('Cannot Delete this user until finish All Tasks ');
    } else {
      this.userService.deleteUser(id).subscribe((res) => {
        this.toastr.success('User Deleted Successfully');
        this.getUsers();
      });
    }
  }
  changeStatus(userId: string, newStatus: string, index: number) {
    this.userService.changeStatus(userId, newStatus).subscribe({
      next: (res) => {
        if (this.dataSource.data[index].assignedTasks > 0) {
          this.toastr.error('Cannot Delete this user until finish All Tasks ');
        } else {
          this.toastr.success('Status updated successfully');
          this.getUsers(); // Refresh table
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to update status');
      },
    });
  }
  selectUser(event: any) {
    console.log(event.value);
    this.dataSource.data = this.users.filter((item) => item._id === event.value);
  }
}
