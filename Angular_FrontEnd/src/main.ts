import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { withComponentInputBinding } from '@angular/router';

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread existing configuration
  providers: [...(appConfig.providers || [])] // Add provideHttpClient()
}).catch((err) => console.error(err));
