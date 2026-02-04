import { UserService } from './../../../core/service/users/user.service';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Task } from '../../../core/service/tasks/task';
import moment from 'moment';
import { User } from '../../../models/user.interface';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';
import { TaskData } from '../../../models/task.interface';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    NgxSpinnerComponent,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask implements OnInit {
  addTaskForm!: FormGroup;
  formValues: any = {};
  file: string = 'No file chosen';
  users: User[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: TaskData,
    private fb: FormBuilder,
    private task: Task,
    private dialogRef: MatDialogRef<AddTask>,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private userService: UserService,
  ) {
    // this.users = [
    //   { id: '696a03c7d0fac501c9fed882', name: 'CharlotteWalker' },
    //   { id: '696a03b4d0fac501c9fed87f', name: 'AlexanderHall' },
    //   { id: '696a03a4d0fac501c9fed87c', name: 'MichaelBrown' },
    //   { id: '696a0392d0fac501c9fed879', name: 'EmilyDavis' },
    //   { id: '696a0370d0fac501c9fed876', name: 'RobertJohnson' },
    //   { id: '696a0362d0fac501c9fed873', name: 'JaneSmith' },
    //   { id: '696a0335d0fac501c9fed870', name: 'AyaOsama' },
    //   { id: '696a0335d0fac501c9fed870', name: 'test' },
    // ];
  }

  ngOnInit(): void {
    this.createForm();
    this.getAllUsers();
  }

  createForm() {
    this.addTaskForm = this.fb.group({
      title: [
        this.updateData?.title || '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
      ],
      userId: [this.updateData?.userId?._id || '', Validators.required],
      image: [this.updateData?.image || null, Validators.required],
      description: [this.updateData?.description || '', Validators.required],
      deadline: [
        new Date(this.updateData?.deadline.split('-').reverse().join('-')) || '',
        Validators.required,
      ],
    });
    this.formValues = this.addTaskForm.value;
  }

  selectImage(event: any) {
    this.addTaskForm.get('image')?.setValue(event.target.files[0]);
  }

  createTask() {
    // this.spinner.show();
    // Only add the error handling part
    let newData = moment(this.addTaskForm.get('deadline')?.value).format('DD-MM-YYYY');

    let data = new FormData();
    Object.entries(this.addTaskForm.value).forEach(([key, value]: any) => {
      if (value === null || value === undefined) return;
      if (key == 'deadline') {
        data.append(key, newData);
      } else {
        data.append(key, value);
      }
    });

    this.task.createTask(data).subscribe({
      next: (res) => {
        // this.spinner.hide();
        this.toastr.success('Task created successfully!');
        this.dialogRef.close(true);
      },
      // error: (error) => {
      //   // ADD THIS SPECIFIC ERROR HANDLING
      //   if (error.message?.includes('EROFS') || error.message?.includes('read-only file system')) {
      //     this.toastr.error(
      //       'Server error: Cannot upload files at the moment. Please try without an image or contact support.',
      //     );
      //   } else {
      //     this.toastr.error(error.message || 'Failed to create task');
      //   }
      // },
    });
    this.addTaskForm.reset();
  }
  updateTask() {
    // this.spinner.show();
    // Only add the error handling part
    let newData = moment(this.addTaskForm.get('deadline')?.value).format('DD-MM-YYYY');

    let data = new FormData();
    Object.entries(this.addTaskForm.value).forEach(([key, value]: any) => {
      if (value === null || value === undefined) return;
      if (key == 'deadline') {
        data.append(key, newData);
      } else {
        data.append(key, value);
      }
    });

    this.task.editTask(data, this.updateData._id).subscribe({
      next: (res) => {
        // this.spinner.hide();
        this.toastr.success('Task Updated successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        // ADD THIS SPECIFIC ERROR HANDLING
        if (error.message?.includes('EROFS') || error.message?.includes('read-only file system')) {
          this.toastr.error(
            'Server error: Cannot upload files at the moment. Please try without an image or contact support.',
          );
        } else {
          this.toastr.error(error.message || 'Failed to create task');
        }
      },
    });
    this.addTaskForm.reset();
  }

  close() {
    let haschanged = false;
    Object.keys(this.formValues).forEach((key) => {
      if (this.formValues[key] !== this.addTaskForm.value[key]) {
        haschanged = true;
      }
    });
    if (haschanged) {
      let dialogRef = this.dialog.open(ConfirmDialog, {
        height: '300px',
        width: '300px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {});
    } else {
      this.dialogRef.close();
    }
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.users;
      console.log(res.users);
    });
  }
}
