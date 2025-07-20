import { Component, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SafePipe } from '../../../safe.pipe';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  selectedCard: any = null;

  cards = [
    {
      image: 'assets/clips/cecy-show.jpg',
      alt: 'Cecy’s Morning Show',
      title: '🎥 Cecy’s Morning Show',
      description: 'Daily highlights from our top-rated morning radio broadcast.',
      iframeUrl: 'https://www.youtube.com/embed/QmRPMDEvpj0?si=KYU3vUFDU3pINY2i'
    },
    {
      image: 'assets/clips/futbol-ne-revs.jpg',
      alt: 'La Pasión del Fútbol',
      title: '⚽ La Pasión del Fútbol',
      description: 'Partidos en vivo con NE Revolution y entrevistas post-juego.',
      iframeUrl: 'https://www.youtube.com/embed/VIDEO_ID2'
    },
    {
      image: 'assets/clips/street-interviews.jpg',
      alt: 'Que Pasa Boston',
      title: '🎤 Que Pasa Boston',
      description: 'Entrevistas espontáneas en las calles de Boston.',
      iframeUrl: 'https://www.youtube.com/embed/VIDEO_ID3'
    },
    {
      image: 'assets/clips/morning-intro.jpg',
      alt: 'Morning Intros',
      title: '🎙️ Morning Radio Intros',
      description: 'Nuestros intros más icónicos en AM/FM.',
      iframeUrl: 'https://open.spotify.com/embed/track/TRACK_ID'
    },
    {
      image: 'assets/clips/tiktok-reel.jpg',
      alt: 'Trending Reel',
      title: '📱 Trending Reel',
      description: 'Viral reel en TikTok e IG: 3.1M+ vistas.',
      iframeUrl: 'https://www.tiktok.com/embed/VIDEO_ID'
    },
  ];

  private swiperInitialized = false;

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    if (!this.swiperInitialized && this.swiperEl?.nativeElement) {
      const swiperContainer = this.swiperEl.nativeElement as any;

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

      this.cards.forEach((card, index) => {
        const slideEl = document.createElement('swiper-slide');
        slideEl.innerHTML = `
          <div class="relative overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 group cursor-pointer" data-index="${index}">
            <img src="${card.image}" alt="${card.alt}" class="w-full h-64 object-cover" />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-6">
              <div class="text-white text-center">
                <h3 class="text-lg font-semibold">${card.title}</h3>
                <p class="text-sm mt-2">${card.description}</p>
              </div>
            </div>
          </div>
        `;
        slideEl.addEventListener('click', () => this.openModal(this.cards[index]));
        swiperContainer.appendChild(slideEl);
      });

      this.swiperInitialized = true;
    }
  }

  openModal(card: any) {
    this.selectedCard = card;
  }

  closeModal() {
    this.selectedCard = null;
  }
}
