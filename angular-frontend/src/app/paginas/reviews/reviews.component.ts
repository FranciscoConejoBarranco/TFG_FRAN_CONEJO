import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { ReviewService } from '../../shared/services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NavbarDashboardComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = false;
  editandoReview: any = null;
  
  // Propiedades para paginación - solo 10 por página
  currentPage = 1;
  totalPages = 1;
  totalReviews = 0;
  pageSize = 10;
  pageSizeOptions = [10]; // Solo 10 como opción

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.cargarMisReviews();
  }

  cargarMisReviews(page: number = 1): void {
    this.loading = true;
    this.reviewService.obtenerMisReviews(page, this.pageSize).subscribe({
      next: (response) => {
        this.reviews = response.reviews;
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.totalReviews = response.pagination.totalReviews;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar reviews:', error);
        this.reviews = [];
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.cargarMisReviews(event.pageIndex + 1);
  }

  editarReview(review: any): void {
    this.editandoReview = { ...review };
  }

  guardarEdicion(): void {
    if (!this.editandoReview) return;

    // Solo enviar el contenido, manteniendo la valoración original
    this.reviewService.editarReview(
      this.editandoReview.id,
      this.editandoReview.contenido,
      this.editandoReview.libro.id,
      this.editandoReview.valoracion // Mantiene la valoración original
    ).subscribe({
      next: () => {
        this.cargarMisReviews(this.currentPage);
        this.editandoReview = null;
      },
      error: (error) => {
        console.error('Error al editar review:', error);
      }
    });
  }

  cancelarEdicion(): void {
    this.editandoReview = null;
  }

  eliminarReview(reviewId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviewService.eliminarReview(reviewId).subscribe({
        next: () => {
          this.cargarMisReviews(this.currentPage);
        },
        error: (error) => {
          console.error('Error al eliminar review:', error);
        }
      });
    }
  }

  getStars(rating: number): string {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    if (halfStar) {
      stars += '½';
    }
    
    return stars;
  }
}
