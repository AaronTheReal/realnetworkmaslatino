import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurismoService, Place } from '../../../../services/turismo-service';
import { CityInfo } from '../../restaurantes';

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-parte-turismo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parte-turismo.html',
  styleUrl: './parte-turismo.css',
})
export class ParteTurismo {
  private turismoService = inject(TurismoService);

  // Ciudad recibida desde el componente padre
  city = input<CityInfo>(DEFAULT_CITY);

  // Slug de la ciudad (ej: 'kansas-city'), usado para consultar el backend
  citySlug = input<string>('');

  // Señales para las atracciones turísticas
  places = signal<Place[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Cada vez que cambie la ciudad, cargamos las atracciones turísticas
    effect(() => {
      const slug = this.citySlug();
      if (slug) {
        this.loadPlaces(slug);
      }
    });
  }

  private loadPlaces(citySlug: string) {
    this.loading.set(true);
    this.error.set(null);

    this.turismoService.getBestTurismo(citySlug).subscribe({
      next: (response) => {
        this.places.set(response.places);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No pudimos cargar las atracciones turísticas en este momento. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }
}
