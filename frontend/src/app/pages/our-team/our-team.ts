import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService, TeamMember } from '../../services/team-service';

@Component({
  selector: 'app-our-team',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './our-team.html',
  styleUrls: ['./our-team.css'], // Asegúrate de usar plural
})
export class OurTeam implements OnInit {
  teamMembers: TeamMember[] = [];
  loadedIndices = new Set<number>();

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getAll().subscribe({
      next: (res: any) => {
        const members: TeamMember[] = res?.data ?? [];
        this.teamMembers = members.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (err) => {
        console.error('Error al cargar el equipo:', err);
      }
    });
  }

  onLoaded(i: number) {
    this.loadedIndices.add(i);
  }
}
