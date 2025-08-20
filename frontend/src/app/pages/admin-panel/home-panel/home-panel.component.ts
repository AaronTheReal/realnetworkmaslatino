import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeService, CarouselItem } from '../../../services/home-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './home-panel.html',
  styleUrl: './home-panel.css',
})
export class HomePanelComponent implements OnInit {
  carouselItems: CarouselItem[] = [];
  form: CarouselItem = this.getEmptyForm();
  isLoading = false;
  mediaErrorMessage: string | null = null;

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

  onTypeChange() {
    // Resetear campos irrelevantes al cambiar tipo para evitar confusión
    if (this.form.type === 'reel') {
      this.form.videoUrl = '';
      this.form.audioUrl = '';
    } else if (this.form.type === 'video') {
      this.form.audioUrl = '';
      this.form.linkUrl = this.form.linkUrl || ''; // Opcional, pero no required
    } else if (this.form.type === 'podcast') {
      this.form.videoUrl = '';
      this.form.linkUrl = this.form.linkUrl || '';
    }
    // Para otros tipos, no resetear
  }

  isValidMediaInput(): boolean {
    // Validaciones dinámicas por tipo
    if (this.form.type === 'reel') {
      return !!this.form.linkUrl && !this.form.videoUrl && !this.form.audioUrl; // Solo linkUrl
    } else if (this.form.type === 'video') {
      return !!this.form.videoUrl; // videoUrl required, otros opcionales pero no conflictivos
    } else if (this.form.type === 'podcast') {
      return !!this.form.audioUrl; // audioUrl required
    } else if (['noticia', 'evento', 'custom'].includes(this.form.type)) {
      return !!this.form.linkUrl; // linkUrl required, video/audio opcionales
    }
    return false; // Si tipo no seleccionado
  }

  onSubmit() {
    this.mediaErrorMessage = null;

    if (!this.isValidMediaInput()) {
      this.mediaErrorMessage = 'Revisa los campos requeridos para el tipo seleccionado. Solo ingresa lo necesario.';
      return;
    }

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      type: '', 
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