// src/app/pages/public/our-voice/our-voice.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceService, VoiceMember } from '../../services/meet-service'; // Asegúrate de usar el mismo servicio

@Component({
  selector: 'app-our-voice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-voice.html',
  styleUrls: ['./our-voice.css']
})
export class OurVoice implements OnInit {
  voiceMembers: VoiceMember[] = [];
  loading = false;

  constructor(private voiceService: VoiceService) {}

  ngOnInit(): void {
    this.loading = true;
    this.voiceService.getAll().subscribe({
      next: (members) => {
        this.voiceMembers = members
          .filter(m => m.isActive)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar voces:', err);
        this.loading = false;
      }
    });
  }
}
