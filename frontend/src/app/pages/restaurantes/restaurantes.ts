import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

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
  imports: [],
  templateUrl: './restaurantes.html',
  styleUrl: './restaurantes.css'
})
export class Restaurantes {
  private route = inject(ActivatedRoute);

  city = toSignal(
    this.route.paramMap.pipe(
      map(params => CITY_MAP[(params.get('ciudad') || '').toLowerCase()] ?? DEFAULT_CITY)
    ),
    { initialValue: DEFAULT_CITY }
  );
}
