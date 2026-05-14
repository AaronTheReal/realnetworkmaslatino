import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { RestaurantsService, Restaurant } from '../../services/places-service';

type CityInfo = {
  name: string;
  image: string;
  highlight: string;
};

const CITY_MAP: Record<string, CityInfo> = {
  'atlanta':       { name: 'ATLANTA',       image: 'assets/cyties/atlanta.png',            highlight: 'ATLANTA' },
  'boston':        { name: 'BOSTON',        image: 'assets/cyties/boston.png',             highlight: 'BOSTON' },
  'dallas':        { name: 'DALLAS',        image: 'assets/cyties/dallas.png',             highlight: 'DALLAS' },
  'filadelfia':    { name: 'FILADELFIA',    image: 'assets/cyties/filadelfia.png',         highlight: 'FILADELFIA' },
  'houston':       { name: 'HOUSTON',       image: 'assets/cyties/houston.png',            highlight: 'HOUSTON' },
  'kansas-city':   { name: 'KANSAS CITY',   image: 'assets/cyties/kansas%20city.png',      highlight: 'KANSAS CITY' },
  'los-angeles':   { name: 'LOS ANGELES',   image: 'assets/cyties/los%20angeles.png',      highlight: 'LOS ANGELES' },
  'miami':         { name: 'MIAMI',         image: 'assets/cyties/miami.png',              highlight: 'MIAMI' },
  'new-york':      { name: 'NEW YORK',      image: 'assets/cyties/new%20york.png',         highlight: 'NEW YORK' },
  'san-francisco': { name: 'SAN FRANCISCO', image: 'assets/cyties/san%20francisco.png',    highlight: 'SAN FRANCISCO' },
  'seattle':       { name: 'SEATTLE',       image: 'assets/cyties/seattle.png',            highlight: 'SEATTLE' },
};

const DEFAULT_CITY: CityInfo = { name: 'TU CIUDAD', image: '', highlight: 'TU CIUDAD' };

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurantes.html',
  styleUrl: './restaurantes.css'
})
export class Restaurantes {
  private route = inject(ActivatedRoute);
  private restaurantsService = inject(RestaurantsService);

  // Señal de la ciudad actual (viene de la URL)
  city = toSignal(
    this.route.paramMap.pipe(
      map(params => CITY_MAP[(params.get('ciudad') || '').toLowerCase()] ?? DEFAULT_CITY)
    ),
    { initialValue: DEFAULT_CITY }
  );

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