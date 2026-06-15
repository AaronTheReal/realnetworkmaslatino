import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HangoutService, Place } from '../../../../services/hangout-service';
import { CityInfo } from '../../restaurantes';

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-parte-hangout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parte-hangout.html',
  styleUrl: './parte-hangout.css',
})
export class ParteHangout {
  private hangoutService = inject(HangoutService);

  // Ciudad recibida desde el componente padre
  city = input<CityInfo>(DEFAULT_CITY);

  // Slug de la ciudad (ej: 'kansas-city'), usado para consultar el backend
  citySlug = input<string>('');

  // Señales para los lugares de hangout
  places = signal<Place[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Cada vez que cambie la ciudad, cargamos los lugares de hangout
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

    this.hangoutService.getBestHangout(citySlug).subscribe({
      next: (response) => {
        this.places.set(response.places);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No pudimos cargar los lugares para hangout en este momento. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }
}
