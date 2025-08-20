import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeaturedPageService, FeaturedPage } from '../../../services/featured-service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-featured-shows-panel',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './featured-shows-panel.html',
  styleUrl: './featured-shows-panel.css',
  standalone: true
})
export class FeaturedShowsPanel implements OnInit {
  featuredPages: FeaturedPage[] = [];
  isEditMode = false;
  selectedPage: FeaturedPage = this.resetFormData();
  showForm = false; // Toggle form visibility

  constructor(private featuredPageService: FeaturedPageService) {}

  ngOnInit(): void {
    this.loadFeaturedPages();
  }

  loadFeaturedPages() {
    this.featuredPageService.getAll().subscribe({
      next: (response) => {
        this.featuredPages = response.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      },
      error: (error) => {
        console.error('Error loading featured pages', error);
      }
    });
  }

  onSubmit() {
    if (this.isEditMode && this.selectedPage._id) {
      this.featuredPageService.update(this.selectedPage._id, this.selectedPage).subscribe({
        next: () => {
          this.loadFeaturedPages();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating featured page', error);
        }
      });
    } else {
      this.featuredPageService.create(this.selectedPage).subscribe({
        next: () => {
          this.loadFeaturedPages();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating featured page', error);
        }
      });
    }
  }

  editPage(page: FeaturedPage) {
    this.selectedPage = { ...page };
    this.isEditMode = true;
    this.showForm = true;
  }

  deletePage(id: string | undefined) {
    if (id && confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      this.featuredPageService.delete(id).subscribe({
        next: () => {
          this.loadFeaturedPages();
        },
        error: (error) => {
          console.error('Error deleting featured page', error);
        }
      });
    }
  }

  saveOrder() {
    const items = this.featuredPages.map((page, index) => ({
      id: page._id ?? '',
      order: index + 1 // Ajusta según necesites
    }));
    this.featuredPageService.reorder(items).subscribe({
      next: (response) => {
        this.featuredPages = response.data;
      },
      error: (error) => {
        console.error('Error reordering featured pages', error);
      }
    });
  }

  resetForm() {
    this.selectedPage = this.resetFormData();
    this.isEditMode = false;
    this.showForm = false;
  }

  private resetFormData(): FeaturedPage {
    return {
      title: '',
      subtitle: '',
      imageUrl: '',
      author: '',
      description: '',
      order: 0
    };
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
}