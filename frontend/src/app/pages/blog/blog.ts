import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';           // ← NUEVO
import { NoticiasPressService } from '../../services/press-service';
import { Noticia } from '../../../models/noticia.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],   // ← RouterModule agregado
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent implements OnInit {

  private pressService = inject(NoticiasPressService);

  pressPosts = signal<Noticia[]>([]);
  loading = signal<boolean>(true);

  // placeholder array used to render skeleton cards while loading
  skeletons = Array.from({ length: 9 });

  ngOnInit() {
    this.pressService.getNoticiasPress(1, 9).subscribe({
      next: (res) => {
        this.pressPosts.set(res.items || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando noticias Press', err);
        this.pressPosts.set([]);
        this.loading.set(false);
      }
    });
  }
}