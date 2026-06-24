import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/app-engine.js';

// Angular 20.3+ trae una protección anti-SSRF que valida el host de la petición
// contra una allowlist. En Netlify Edge el host que llega en request.url no
// coincide con el dominio público, así que esa protección hacía un fallback
// silencioso a CSR (las noticias salían sin meta tags para los bots → sin preview).
//
// Desactivarla es seguro en esta app: el SSR sólo hace fetch a un backend FIJO
// (no derivado del host) y las URLs canónicas/OG están hardcodeadas a
// maslatinonetwork.com (no se refleja el host de la petición), por lo que no hay
// vector de SSRF ni de host-header poisoning.
AngularAppEngine.ɵdisableAllowedHostsCheck = true;

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();
  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
