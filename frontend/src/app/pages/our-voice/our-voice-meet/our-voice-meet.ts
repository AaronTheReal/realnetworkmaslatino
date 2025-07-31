import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE
import { VoiceService, VoiceMember } from '../../../services/meet-service';

@Component({
  selector: 'app-our-voice-meet',
  standalone: true,
  imports: [CommonModule], // 👈 AÑADIR CommonModule aquí
  templateUrl: './our-voice-meet.html',
  styleUrl: './our-voice-meet.css'
})
export class OurVoiceMeet {
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
