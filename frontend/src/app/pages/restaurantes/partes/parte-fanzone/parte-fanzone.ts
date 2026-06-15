import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FanzoneService, Place, FanFestZone } from '../../../../services/fanzone-service';
import { CityInfo } from '../../restaurantes';

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-parte-fanzone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parte-fanzone.html',
  styleUrl: './parte-fanzone.css',
})
export class ParteFanzone {
  private fanzoneService = inject(FanzoneService);

  // Ciudad recibida desde el componente padre
  city = input<CityInfo>(DEFAULT_CITY);

  // Slug de la ciudad (ej: 'kansas-city'), usado para consultar el backend
  citySlug = input<string>('');

  // Señales para los bares deportivos y la zona oficial de Fan Fest
  places = signal<Place[]>([]);
  fanFest = signal<FanFestZone | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Cada vez que cambie la ciudad, cargamos los bares deportivos
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

    this.fanzoneService.getBestFanzone(citySlug).subscribe({
      next: (response) => {
        this.places.set(response.places);
        this.fanFest.set(response.fanFest ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No pudimos cargar los bares deportivos en este momento. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }
}
