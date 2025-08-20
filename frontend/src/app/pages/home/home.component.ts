import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SafePipe } from '../../../safe.pipe';
import { HomeService, CarouselItem } from './../../services/home-service';

// 🔥 Declarar globals para TikTok, Instagram y Facebook (evita errores TS)
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: (elements: Element[]) => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  selectedCard: CarouselItem | null = null;
  carouselItems: CarouselItem[] = [];
  private swiperInitialized = false;
  constructor(private homeService: HomeService) {}
  ngOnInit(): void {
    this.homeService.getAllCarouselItems().subscribe({
      next: (items) => {
        this.carouselItems = (items || [])
          .filter((i) => i.isActive !== false) // muestra true o undefined
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        // Si el swiper ya está en el DOM, intenta montarlo
        setTimeout(() => this.tryInitSwiper(), 0);
      },
      error: (err) => {
        console.error('Error cargando carousel items', err);
      },
    });
  }
  ngAfterViewInit(): void {
    // Si ya cargaron los items antes de que exista el swiper en el DOM
    this.tryInitSwiper();
  }
  ngAfterViewChecked(): void {
    // fallback por si algo se montó después
    this.tryInitSwiper();
  }
  private tryInitSwiper(): void {
    if (
      this.swiperInitialized ||
      !this.swiperEl?.nativeElement ||
      this.carouselItems.length === 0
    ) {
      return;
    }
    const swiperContainer = this.swiperEl.nativeElement as any;
    // Props del web component
    swiperContainer.slidesPerView = 1;
    swiperContainer.spaceBetween = 20;
    swiperContainer.navigation = true;
    swiperContainer.pagination = true;
    swiperContainer.loop = true;
    swiperContainer.autoplay = {
      delay: 2500,
      disableOnInteraction: false,
    };
    swiperContainer.breakpoints = {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    };
    // Crea las slides desde la BD
    this.carouselItems.forEach((item, index) => {
      const slideEl = document.createElement('swiper-slide');
      const title = item.title ?? '';
      const subtitle = item.subtitle ?? '';
      const description = item.description ?? '';
      const image = item.coverImage;
      const alt = item.title ?? 'item';
      const clickIndex = index;
      slideEl.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 group cursor-pointer" data-index="${clickIndex}">
          <img src="${image}" alt="${alt}" class="w-full h-64 object-cover" />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-6">
            <div class="text-white text-center">
              <h3 class="text-lg font-semibold">${title}</h3>
              ${subtitle ? `<p class="text-sm mt-1 opacity-80">${subtitle}</p>` : ''}
              ${description ? `<p class="text-sm mt-2">${description}</p>` : ''}
            </div>
          </div>
          ${
            item.type === 'video' && item.videoUrl
              ? `<span class="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">VIDEO</span>`
              : item.type === 'podcast' && item.audioUrl
              ? `<span class="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">PODCAST</span>`
              : `<span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">${item.type?.toUpperCase() ?? 'CONTENT'}</span>`
          }
        </div>
      `;
      slideEl.addEventListener('click', () => this.openModal(this.carouselItems[index]));
      swiperContainer.appendChild(slideEl);
    });
    this.swiperInitialized = true;
  }
  openModal(item: CarouselItem) {
    if (!item.iframeUrl) {
      console.warn('No iframeUrl for item:', item);
      return;
    }
    this.selectedCard = { ...item };
    // Cargar script dinámicamente (forzando recarga para TikTok/Facebook/Instagram)
    this.loadEmbedScript(item.embedProvider);
  }

  private loadEmbedScript(provider?: string) {
    let scriptSrc: string | undefined;
    let scriptId: string | undefined;
    if (provider === 'tiktok') {
      scriptSrc = 'https://www.tiktok.com/embed.js';
      scriptId = 'tiktok-embed-script';
    } else if (provider === 'instagram') {
      scriptSrc = '//www.instagram.com/embed.js';
      scriptId = 'instagram-embed-script';
    } else if (provider === 'facebook') {
      scriptSrc = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0';
      scriptId = 'facebook-embed-script';
    }
    if (scriptSrc && scriptId && provider) {
      // Remover script existente para forzar recarga (crucial para TikTok/Facebook dinámico)
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.parentNode?.removeChild(existingScript);
      }
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        console.log(`${provider} script loaded successfully`);
        // Reinit solo para Instagram/Facebook; para TikTok, la carga procesa automáticamente
        setTimeout(() => this.reinitEmbeds(provider), 300); // Mayor delay para DOM ready
      };
      script.onerror = (err) => console.error(`${provider} script failed to load:`, err);
    }
  }
  // 🔥 Método para reinicializar embeds dinámicos
  private reinitEmbeds(provider?: string) {
    if (!provider) return;
    if (provider === 'instagram' && window.instgrm?.Embeds?.process) {
      window.instgrm.Embeds.process();
      console.log('Instagram embeds reprocessed');
    } else if (provider === 'facebook' && window.FB?.XFBML?.parse) {
      window.FB.XFBML.parse();
      console.log('Facebook embeds reprocessed');
    }
    // Para TikTok, no hay API de reinit; la recarga del script maneja el processing
  }
  // getEmbedContent: ya está bien, remueve <script> correctamente
  getEmbedContent(iframeUrl?: string): string {
    if (!iframeUrl) return '';
    return iframeUrl
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  closeModal() {
    this.selectedCard = null;
  }
  // Helper para resolver el URL que vas a embeber o abrir (opcional, si necesitas fallback para non-embed types)
  resolveMediaUrl(item: CarouselItem): string | undefined {
    if (item.type === 'video' && item.videoUrl) return item.videoUrl;
    if (item.type === 'podcast' && item.audioUrl) return item.audioUrl;
    return item.linkUrl;
  }
}