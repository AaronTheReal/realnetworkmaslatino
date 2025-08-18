import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService, TeamMember } from '../../services/team-service'; // Asegúrate de que la ruta sea correcta
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css'],
  encapsulation: ViewEncapsulation.None,

})
export class AboutUsComponent implements OnInit {
  teamMembers: TeamMember[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
      this.teamService.getAll().subscribe({
      next: (res: any) => {
        const members: TeamMember[] = res.data ?? [];
        this.teamMembers = members.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (err) => {
        console.error('Error al cargar el equipo:', err);
      }
    });
  }
}
