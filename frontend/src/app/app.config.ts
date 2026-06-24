import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // ✅ IMPORTANTE
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { ssrStripCookiesInterceptor } from './interceptors/ssr-strip-cookies.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // withFetch → usa la API fetch (necesaria/recomendada en el entorno SSR de Netlify)
    provideHttpClient(withFetch(), withInterceptors([ssrStripCookiesInterceptor])),
    // Hidratación: reaprovecha el HTML del servidor en el cliente (sin flicker)
    provideClientHydration(withEventReplay())
  ]
};
