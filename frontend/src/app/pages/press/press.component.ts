import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-press',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.css']
})
export class PressComponent {
  constructor(private router: Router) {}

  goToPressRelease() {
    this.router.navigate(['/press-release']);
  }
}
