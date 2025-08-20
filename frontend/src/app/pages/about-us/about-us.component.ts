import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, TeamMember } from '../../services/team-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  crossSize: number = 120; // Tamaño inicial (100px x 100px)
  crossThickness: number = 30; // Grosor inicial (25px, para que coincida con tu CSS)
  crossOffset: number = 0; // Sin desplazamiento para estar pegada a la esquina

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getAll().subscribe({
      next: (res: any) => {
        const members: TeamMember[] = res.data ?? [];
        this.teamMembers = members.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (err) => {
        console.error('Error al cargar el equipo:', err);
      },
    });
    console.log('Valores iniciales:', { crossSize: this.crossSize, crossThickness: this.crossThickness, crossOffset: this.crossOffset });
  }

  increaseSize(increment: number = 10) {
    this.crossSize += increment;
    this.crossThickness = Math.max(2, this.crossThickness + increment / 4);
    console.log('Aumentado:', { crossSize: this.crossSize, crossThickness: this.crossThickness, crossOffset: this.crossOffset });
  }

  decreaseSize(decrement: number = 10) {
    this.crossSize = Math.max(16, this.crossSize - decrement);
    this.crossThickness = Math.max(2, this.crossThickness - decrement / 4);
    console.log('Reducido:', { crossSize: this.crossSize, crossThickness: this.crossThickness, crossOffset: this.crossOffset });
  }

  setSize(size: number) {
    this.crossSize = Math.max(16, size);
    this.crossThickness = Math.max(2, size / 4); // Grosor proporcional
    console.log('Establecido:', { crossSize: this.crossSize, crossThickness: this.crossThickness, crossOffset: this.crossOffset });
  }
}