// blog-individual.component.ts → VERSIÓN con SEO/SSR (OpenGraph, Twitter, JSON-LD)
import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, NgOptimizedImage, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Observable, of, switchMap, tap } from 'rxjs';
import { NoticiasPressService } from '../../../services/press-service';
import { Noticia, Block } from '../../../../models/noticia.model';

// Dominio canónico de ESTE proyecto (página distinta a maslatino.com)
const SITE_ORIGIN = 'https://maslatinonetwork.com';
const SITE_NAME = 'Más Latino Network';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/footer/FooterFoto2.png`;
const SITE_LOGO = `${SITE_ORIGIN}/favicon.png`;

@Component({
  selector: 'app-blog-individual',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, NgOptimizedImage],
  templateUrl: './blog-individual.html',
  styleUrl: './blog-individual.css'
})
export class BlogIndividual implements OnInit {

  private route = inject(ActivatedRoute);
  private pressService = inject(NoticiasPressService);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  noticia$: Observable<Noticia | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const slug = params.get('slug');
      return slug ? this.pressService.getNoticiaBySlug(slug) : of(null);
    }),
    // Inyecta los meta tags en SSR (lo que leen los bots) y también en el navegador
    tap(noticia => { if (noticia) this.applySeo(noticia); })
  );

  // Signal con las 3 recomendaciones reales (ordenadas más antigua → más reciente)
  recommended = signal<Noticia[]>([]);
  recLoading = signal<boolean>(true);

  // placeholder array used to render skeleton cards while loading
  recSkeletons = Array.from({ length: 3 });

  trackByIndex = (i: number) => i;

  ngOnInit() {
    // Las recomendaciones NO son críticas para SEO → se cargan solo en el navegador.
    // Esto evita un segundo round-trip al backend durante el render del Edge (TTFB).
    if (!isPlatformBrowser(this.platformId)) return;

    this.pressService.getNoticiasPress(1, 6).subscribe({
      next: (res) => {
        const sortedOldestFirst = [...(res.items || [])]
          .sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeA - timeB;   // más antigua primero
          })
          .slice(0, 3);

        this.recommended.set(sortedOldestFirst);
        this.recLoading.set(false);
      },
      error: () => {
        this.recommended.set([]);
        this.recLoading.set(false);
      }
    });
  }

  // ============ SEO ============

  private applySeo(noticia: Noticia): void {
    const url = `${SITE_ORIGIN}/blog/${noticia.slug ?? ''}`;
    const rawTitle = noticia.meta?.ogTitle || noticia.title || SITE_NAME;
    const pageTitle = `${rawTitle} | ${SITE_NAME}`;
    const description = this.buildDescription(noticia);
    const image = this.ensureAbsoluteHttpsUrl(noticia.meta?.image);

    // Title + description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: rawTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    if (noticia.publishAt || noticia.createdAt) {
      this.meta.updateTag({ property: 'article:published_time', content: (noticia.publishAt || noticia.createdAt)! });
    }
    if (noticia.updatedAt) {
      this.meta.updateTag({ property: 'article:modified_time', content: noticia.updatedAt });
    }

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@maslatino_' });
    this.meta.updateTag({ name: 'twitter:title', content: rawTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.setCanonical(noticia.meta?.canonical || url);

    // JSON-LD NewsArticle
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: noticia.title,
      description,
      image: [image],
      datePublished: noticia.publishAt || noticia.createdAt || undefined,
      dateModified: noticia.updatedAt || noticia.publishAt || noticia.createdAt || undefined,
      author: {
        '@type': 'Organization',
        name: noticia.authorName || SITE_NAME,
        url: SITE_ORIGIN
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: { '@type': 'ImageObject', url: SITE_LOGO }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url }
    });
  }

  /** Construye una descripción limpia (sin HTML), máx. 300 chars. */
  private buildDescription(noticia: Noticia): string {
    const raw =
      noticia.meta?.description ||
      noticia.extracto ||
      noticia.summary ||
      this.textFromContent(noticia.content) ||
      `${noticia.title} — ${SITE_NAME}`;

    const text = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 300 ? `${text.slice(0, 297).trimEnd()}…` : text;
  }

  /** Extrae texto plano de los primeros bloques de texto del cuerpo. */
  private textFromContent(content?: Block[]): string {
    if (!content?.length) return '';
    return content
      .filter(b => b?.type === 'text')
      .map(b => b?.text || b?.html || '')
      .join(' ')
      .slice(0, 600);
  }

  /** Garantiza una URL https:// absoluta (los bots rechazan relativas / http). */
  private ensureAbsoluteHttpsUrl(url?: string | null): string {
    if (!url) return DEFAULT_OG_IMAGE;
    let u = url.trim();
    if (!u) return DEFAULT_OG_IMAGE;
    if (u.startsWith('//')) return `https:${u}`;
    if (u.startsWith('http://')) return `https://${u.slice('http://'.length)}`;
    if (u.startsWith('https://')) return u;
    // ruta relativa
    return `${SITE_ORIGIN}${u.startsWith('/') ? u : '/' + u}`;
  }

  /** Inserta/actualiza <link rel="canonical"> sin duplicar. */
  private setCanonical(href: string): void {
    const head = this.document.head;
    if (!head) return;
    let link = head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** Inserta/actualiza el <script application/ld+json> (dedup con data-noticia). */
  private setJsonLd(data: Record<string, unknown>): void {
    const head = this.document.head;
    if (!head) return;
    let script = head.querySelector("script[type='application/ld+json'][data-noticia]") as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-noticia', '');
      head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
