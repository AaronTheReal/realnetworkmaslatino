import { Component, inject, signal, effect, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { RestaurantesParte } from './partes/restaurantes-parte/restaurantes-parte';
import { Partes, SectionKey } from './partes/partes';
import { ParteEventos } from './partes/parte-eventos/parte-eventos';
import { ParteHangout } from './partes/parte-hangout/parte-hangout';
import { ParteFanzone } from './partes/parte-fanzone/parte-fanzone';
import { ParteTurismo } from './partes/parte-turismo/parte-turismo';
import {
  WeatherService,
  WeatherData,
  WEATHER_ICONS,
  WEATHER_FEELS_LIKE_ICON,
  WEATHER_PRECIPITATION_ICON,
} from '../../services/weather-service';

export type CityInfo = {
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

// Orden cíclico de las secciones para la navegación con flechas (modo carrusel)
const SECTION_ORDER: SectionKey[] = ['eventos', 'hangout', 'fanzone', 'turismo', 'restaurantes'];

// Color representativo de cada sección (acorde al fondo de su hero)
const SECTION_COLORS: Record<SectionKey, string> = {
  eventos: '#fe0900',
  hangout: '#b121fe',
  fanzone: '#00cf82',
  turismo: '#fdb700',
  restaurantes: '#9747FF',
};

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, RestaurantesParte, Partes, ParteEventos, ParteHangout, ParteFanzone, ParteTurismo],
  templateUrl: './restaurantes.html',
  styleUrl: './restaurantes.css'
})
export class Restaurantes {
  private route = inject(ActivatedRoute);
  private weatherService = inject(WeatherService);

  // Señal de la ciudad actual (viene de la URL)
  city = toSignal(
    this.route.paramMap.pipe(
      map(params => CITY_MAP[(params.get('ciudad') || '').toLowerCase()] ?? DEFAULT_CITY)
    ),
    { initialValue: DEFAULT_CITY }
  );

  // Slug de la ciudad actual (viene de la URL), usado para consultar el clima
  citySlug = toSignal(
    this.route.paramMap.pipe(
      map(params => (params.get('ciudad') || '').toLowerCase())
    ),
    { initialValue: '' }
  );

  // Señales para el clima
  weather = signal<WeatherData | null>(null);
  weatherLoading = signal<boolean>(true);
  weatherError = signal<string | null>(null);

  // Icono según la condición climática actual
  weatherIcon = computed(() => {
    const data = this.weather();
    return data ? WEATHER_ICONS[data.condition] : WEATHER_ICONS['soleado'];
  });

  // Icono fijo para la sensación térmica
  feelsLikeIcon = WEATHER_FEELS_LIKE_ICON;

  // Icono fijo para la probabilidad de lluvia
  precipitationIcon = WEATHER_PRECIPITATION_ICON;

  // Sección seleccionada en el selector de categorías ("Restaurantes" por defecto)
  selectedSection = signal<SectionKey>('restaurantes');

  // Modo carrusel: oculta app-partes y muestra el contenido con flechas de navegación
  carouselMode = signal<boolean>(false);

  // Orden de las secciones, expuesto para el indicador de "dots" del template
  readonly sectionOrder = SECTION_ORDER;

  // Color representativo de la sección activa (acento dinámico del pill/dots)
  activeSectionColor = computed(() => SECTION_COLORS[this.selectedSection()]);

  // Color representativo de una sección dada (para los dots)
  colorFor(section: SectionKey): string {
    return SECTION_COLORS[section];
  }

  // Selecciona una sección desde app-partes y activa el modo carrusel
  onSectionSelected(section: SectionKey) {
    this.selectedSection.set(section);
    this.carouselMode.set(true);
  }

  // Vuelve a mostrar el selector de categorías (app-partes)
  closeCarousel() {
    this.carouselMode.set(false);
  }

  // Avanza a la siguiente sección en orden cíclico
  nextSection() {
    const currentIndex = SECTION_ORDER.indexOf(this.selectedSection());
    const nextIndex = (currentIndex + 1) % SECTION_ORDER.length;
    this.selectedSection.set(SECTION_ORDER[nextIndex]);
  }

  // Retrocede a la sección anterior en orden cíclico
  prevSection() {
    const currentIndex = SECTION_ORDER.indexOf(this.selectedSection());
    const prevIndex = (currentIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length;
    this.selectedSection.set(SECTION_ORDER[prevIndex]);
  }

  // Unidad de temperatura seleccionada (por defecto Fahrenheit: ciudades de EE. UU.)
  temperatureUnit = signal<'C' | 'F'>('F');

  // Temperatura actual mostrada según la unidad seleccionada
  displayTemperature = computed(() => this.convertTemperature(this.weather()?.temperature));

  // Sensación térmica mostrada según la unidad seleccionada
  displayFeelsLike = computed(() => this.convertTemperature(this.weather()?.feelsLike));

  setUnit(unit: 'C' | 'F') {
    this.temperatureUnit.set(unit);
  }

  // El backend entrega las temperaturas en Fahrenheit; convertimos localmente sin volver a consultar la API
  private convertTemperature(fahrenheit: number | undefined): number | null {
    if (fahrenheit == null) return null;
    return this.temperatureUnit() === 'F'
      ? Math.round(fahrenheit)
      : Math.round((fahrenheit - 32) * 5 / 9);
  }

  constructor() {
    // Cada vez que cambie la ciudad, consultamos el clima
    effect(() => {
      const slug = this.citySlug();
      if (slug && CITY_MAP[slug]) {
        this.loadWeather(slug);
      }
    });
  }

  private loadWeather(citySlug: string) {
    this.weatherLoading.set(true);
    this.weatherError.set(null);

    this.weatherService.getWeather(citySlug).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.weatherLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.weatherError.set('No pudimos cargar el clima en este momento.');
        this.weatherLoading.set(false);
      }
    });
  }
}