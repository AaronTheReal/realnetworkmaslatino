import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

/**
 * Durante el SSR (entorno Deno/Edge de Netlify) las peticiones que la app
 * hace al backend pueden arrastrar headers gigantes del visitante
 * (Cookie / Authorization / X-Forwarded-For). El backend (openresty) los
 * rechaza con `400 Request Header Or Cookie Too Large`.
 *
 * Este interceptor elimina esos headers SOLO en el servidor. En el navegador
 * no toca nada (las cookies/headers normales del browser siguen igual).
 */
export const ssrStripCookiesInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    const cleaned = req.clone({
      headers: req.headers
        .delete('Cookie')
        .delete('cookie')
        .delete('Authorization')
        .delete('authorization')
        .delete('X-Forwarded-For')
        .delete('x-forwarded-for')
    });
    return next(cleaned);
  }

  return next(req);
};
