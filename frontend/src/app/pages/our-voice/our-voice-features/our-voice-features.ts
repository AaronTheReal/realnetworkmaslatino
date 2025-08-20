import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedPageService, FeaturedPage } from '../../../services/featured-service';

@Component({
  selector: 'app-our-voice-features',
  imports: [CommonModule],
  templateUrl: './our-voice-features.html',
  styleUrl: './our-voice-features.css'
})
export class OurVoiceFeatures implements OnInit {
  featuredPages: FeaturedPage[] = [];

  constructor(private featuredPageService: FeaturedPageService) {}

  ngOnInit(): void {
    this.featuredPageService.getAll().subscribe({
      next: (response) => {
        this.featuredPages = response.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (err) => {
        console.error('Error al cargar featured pages:', err);
      }
    });
  }

  getFormattedDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
}