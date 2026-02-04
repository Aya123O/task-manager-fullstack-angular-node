import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  spinner.show();
  console.log('Loader Interceptor: Request started');
  return next(req).pipe(
    finalize(() => {
      spinner.hide();
      console.log('Loader Interceptor: Request finished');
    }),
  );
};
