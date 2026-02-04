// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/interceptor/auth-interceptor';
import { loaderInterceptor } from './app/core/interceptor/loader-interceptor';
import { errorInterceptor } from './app/core/interceptor/error-interceptor';

// Add interceptors to the existing appConfig
const mergedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(
      withInterceptors([authInterceptor, loaderInterceptor, errorInterceptor])
    )
  ]
};

bootstrapApplication(App, mergedConfig).catch(err => console.error(err));