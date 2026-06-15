// blog-individual.component.ts → VERSIÓN 100% CORREGIDA (sin errores TS)
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { NoticiasPressService } from '../../../services/press-service';
import { Noticia } from '../../../../models/noticia.model';

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

  noticia$: Observable<Noticia | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const slug = params.get('slug');
      return slug ? this.pressService.getNoticiaBySlug(slug) : of(null);
    })
  );

  // Signal con las 3 recomendaciones reales (ordenadas más antigua → más reciente)
  recommended = signal<Noticia[]>([]);
  recLoading = signal<boolean>(true);

  // placeholder array used to render skeleton cards while loading
  recSkeletons = Array.from({ length: 3 });

  trackByIndex = (i: number) => i;

  ngOnInit() {
    this.pressService.getNoticiasPress(1, 6).subscribe({
      next: (res) => {
        const sortedOldestFirst = [...(res.items || [])]
          .sort((a, b) => {
            // ✅ Corrección del error: createdAt puede ser undefined
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
}