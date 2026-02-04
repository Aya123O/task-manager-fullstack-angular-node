import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      toaster.error(
        error.error?.message || 'An unexpected error occurred',
        `Error ${error.status}`,
      );
      if (error.error?.message === 'expired token' || error.status === 401) {
        router.navigate(['/login']);
        localStorage.removeItem('token');
      }
      throw error;
    }),
  );
};
