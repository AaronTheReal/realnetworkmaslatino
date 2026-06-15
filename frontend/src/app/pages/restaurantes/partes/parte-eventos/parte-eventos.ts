import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosService, Match } from '../../../../services/eventos-service';
import { CityInfo } from '../../restaurantes';

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-parte-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parte-eventos.html',
  styleUrl: './parte-eventos.css',
})
export class ParteEventos {
  private eventosService = inject(EventosService);

  // Ciudad recibida desde el componente padre
  city = input<CityInfo>(DEFAULT_CITY);

  // Slug de la ciudad (ej: 'kansas-city'), usado para consultar el backend
  citySlug = input<string>('');

  // Señales para los partidos del Mundial 2026
  matches = signal<Match[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Cada vez que cambie la ciudad, cargamos los partidos
    effect(() => {
      const slug = this.citySlug();
      if (slug) {
        this.loadMatches(slug);
      }
    });
  }

  private loadMatches(citySlug: string) {
    this.loading.set(true);
    this.error.set(null);

    this.eventosService.getEventosByCity(citySlug).subscribe({
      next: (response) => {
        this.matches.set(response.matches);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No pudimos cargar los partidos del Mundial en este momento. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
