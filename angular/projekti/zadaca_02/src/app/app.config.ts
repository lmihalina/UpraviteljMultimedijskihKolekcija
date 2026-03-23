import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { KonfiguratorService } from './servisi/konfigurator.service';
import { APP_CONF } from './servisI/konfigurator';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer( () => inject(KonfiguratorService).load() ),
    {provide : APP_CONF, useFactory : () => inject(KonfiguratorService).value}
  ]
};
