import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Mapa de qué se renderiza dónde en el servidor.
 *
 * SSR (RenderMode.Server) SOLO para las noticias individuales (`blog/:slug`),
 * que son las que necesitan preview social / SEO real (OpenGraph, Twitter,
 * JSON-LD NewsArticle) inyectado en el HTML que leen los bots.
 *
 * Todo lo demás (home, blogs, brands, creators, cities, admin, etc.) se sirve
 * como SPA (RenderMode.Client): el servidor devuelve el shell y Angular
 * renderiza en el navegador, igual que antes — sin riesgo de SSR.
 */
export const serverRoutes: ServerRoute[] = [
  // 🔥 Única ruta con SSR real
  { path: 'blog/:slug', renderMode: RenderMode.Server },

  // Fallback seguro: cualquier otra ruta NO intenta SSR
  { path: '**', renderMode: RenderMode.Client },
];
