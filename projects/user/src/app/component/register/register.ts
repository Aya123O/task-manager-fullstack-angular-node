import { email } from '@angular/forms/signals';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { MatInputModule, MatFormField, MatLabel, MatError } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
    NgxSpinnerComponent,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _Auth: Auth,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) {}
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        confirmpassword: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
        ],
        role: ['user'],
      },
      { validators: this.checkPassword },
    );
  }
  register() {
    this.spinner.show();

    this._Auth.registerForm(this.registerForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.toastr.success('Register Successfully', 'Success');
        this.spinner.hide();
        this.router.navigateByUrl('/login');
      },

      error: () => {
        this.spinner.hide();
        this.toastr.error('Register Failed');
      },
    });
    console.log(this.registerForm);
  }

  checkPassword(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmpassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }
}
