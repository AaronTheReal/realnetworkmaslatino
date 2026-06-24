import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/app-engine.js';

const angularAppEngine = new AngularAppEngine({
  // Hosts autorizados para SSR. Sin esto, la protección anti-SSRF de Angular 20.3+
  // no reconoce el dominio y hace fallback silencioso a CSR (sin meta tags para bots).
  // En Netlify Edge, request.url ya trae el host real (maslatinonetwork.com), así que
  // no se necesita trustProxyHeaders (que además podía provocar un 400 en hosts internos).
  allowedHosts: ['maslatinonetwork.com', 'www.maslatinonetwork.com'],
});

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();
  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
