// src/app/pages/home-panel/home-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Necesario para ngModel y ngForm
import { RouterModule } from '@angular/router';
import { HomeService, CarouselItem } from '../../../services/home-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule], // ✅ Agrega FormsModule aquí
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.css',
})
export class HomePanelComponent implements OnInit {
  carouselItems: CarouselItem[] = [];
  form: CarouselItem = this.getEmptyForm();
  isLoading = false;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.isLoading = true;
    this.homeService.getAllCarouselItems().subscribe({
      next: (data) => {
        this.carouselItems = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener el carrusel:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form._id) {
      this.homeService.updateCarouselItem(this.form._id, this.form).subscribe({
        next: (updated) => {
          const index = this.carouselItems.findIndex(i => i._id === updated._id);
          if (index !== -1) this.carouselItems[index] = updated;
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
        }
      });
    } else {
      this.homeService.createCarouselItem(this.form).subscribe({
        next: (created) => {
          this.carouselItems.push(created);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al crear:', err);
        }
      });
    }
  }

  editItem(item: CarouselItem) {
    this.form = { ...item };
    window.scrollTo({ top: 0, behavior: 'smooth' }); // opcional para usabilidad
  }

  deleteItem(id?: string) {
    if (!id || !confirm('¿Estás seguro de eliminar este item?')) return;

    this.homeService.deleteCarouselItem(id).subscribe({
      next: () => {
        this.carouselItems = this.carouselItems.filter(i => i._id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
      }
    });
  }

  resetForm() {
    this.form = this.getEmptyForm();
  }

  private getEmptyForm(): CarouselItem {
    return {
      title: '',
      subtitle: '',
      description: '',
      type: 'custom',
      coverImage: '',
      videoUrl: '',
      audioUrl: '',
      linkUrl: '',
      position: 0,
      isActive: true,
      tags: [],
    };
  }
}
