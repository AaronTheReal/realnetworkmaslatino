import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { Observable, of, tap, shareReplay, catchError, map } from 'rxjs';  // ← map agregado aquí
import { Noticia } from '../../models/noticia.model';
import { isPlatformServer } from '@angular/common';

export interface NoticiaCategoriaPage {
  items: Noticia[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class NoticiasPressService {

  private http = inject(HttpClient);
  private ts = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  private baseUrl = 'https://maslatinoregular.onrender.com/aaron/maslatino';

  // === LISTADO DE PRESS ===
  getNoticiasPress(page: number = 1, limit: number = 12): Observable<NoticiaCategoriaPage> {
    const key = makeStateKey<NoticiaCategoriaPage>(`press-corporativa-p${page}-l${limit}`);

    if (this.ts.hasKey(key)) {
      const data = this.ts.get<NoticiaCategoriaPage>(key, { items: [], total: 0, page, totalPages: 1, limit, hasNextPage: false, hasPrevPage: false });
      this.ts.remove(key);
      return of(data);
    }

    const observable = this.http
      .get<NoticiaCategoriaPage>(`${this.baseUrl}/noticias/press`, {
        params: new HttpParams().set('page', page.toString()).set('limit', limit.toString())
      })
      .pipe(shareReplay(1));

    if (isPlatformServer(this.platformId)) {
      return observable.pipe(tap(data => this.ts.set(key, data)));
    }

    return observable;
  }

  // 🔥 MÉTODO CORREGIDO (sin errores de map, tipos ni implicit any)
  getNoticiaBySlug(slug: string): Observable<Noticia | null> {
    const key = makeStateKey<Noticia | null>('noticia-slug-' + slug);

    if (this.ts.hasKey(key)) {
      const data = this.ts.get<Noticia | null>(key, null);
      this.ts.remove(key);
      return of(data);
    }

    const observable = this.http
      .get<{ noticia: Noticia }>(`${this.baseUrl}/noticia/slug/${encodeURIComponent(slug)}`)
      .pipe(
        map(r => r.noticia || null),
        shareReplay(1)
      );

    if (isPlatformServer(this.platformId)) {
      return observable.pipe(tap(data => this.ts.set(key, data)));
    }

    return observable;
  }
}