import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const SCROLL_TOLERANCE = 50;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;
  private scrollYOnOpen = 0;
  private scrollListenerActive = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.scrollYOnOpen = window.scrollY;
      // delay activating scroll listener so the DOM paint from *ngIf
      // doesn't immediately trigger a false close
      setTimeout(() => { this.scrollListenerActive = true; }, 250);
    } else {
      this.scrollListenerActive = false;
    }
  }

  closeMenu() {
    this.menuOpen = false;
    this.scrollListenerActive = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.menuOpen && this.scrollListenerActive &&
        Math.abs(window.scrollY - this.scrollYOnOpen) > SCROLL_TOLERANCE) {
      this.closeMenu();
    }
  }
}