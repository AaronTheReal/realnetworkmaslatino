import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantsService, Restaurant } from '../../../../services/places-service';
import { CityInfo } from '../../restaurantes';

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-restaurantes-parte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurantes-parte.html',
  styleUrl: './restaurantes-parte.css',
})
export class RestaurantesParte {
  private restaurantsService = inject(RestaurantsService);

  // Ciudad recibida desde el componente padre
  city = input<CityInfo>(DEFAULT_CITY);

  // Señales para los restaurantes
  restaurants = signal<Restaurant[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Cada vez que cambie la ciudad, cargamos los restaurantes
    effect(() => {
      const currentCity = this.city();
      if (currentCity.highlight !== 'TU CIUDAD') {
        this.loadRestaurants(currentCity.highlight);
      }
    });
  }

  private loadRestaurants(cityName: string) {
    this.loading.set(true);
    this.error.set(null);

    this.restaurantsService.getBestRestaurants(cityName).subscribe({
      next: (response) => {
        this.restaurants.set(response.restaurants);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No pudimos cargar los restaurantes en este momento. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }
}
