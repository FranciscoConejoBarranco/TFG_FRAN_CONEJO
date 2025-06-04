import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../shared/services/review.service';
import { ReviewInterface } from '../../shared/interfaces/review.interface';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit, OnChanges {
  @Input() libroId!: number; // Recibe el ID del libro desde el padre

  reviews: ReviewInterface[] = [];
  miReview: ReviewInterface | null = null;
  nuevoContenido = '';
  nuevaValoracion = 5;
  mostrandoFormulario = false;

  // Nuevas propiedades para paginación
  currentPage = 1;
  totalPages = 1;
  totalReviewsCount = 0;
  loading = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    if (this.libroId) {
      this.cargarReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['libroId'] && changes['libroId'].currentValue) {
      this.currentPage = 1; // Reset página al cambiar libro
      this.cargarReviews();
    }
  }

  cargarReviews(page: number = this.currentPage): void {
    this.loading = true;
    this.reviewService
      .obtenerReviewsPorLibro(this.libroId, page, 10)
      .subscribe({
        next: (response) => {
          this.reviews = response.reviews;
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.totalReviewsCount = response.pagination.totalReviews;
  
          this.miReview = response.miReview || null;
          if (this.miReview) {
            this.nuevoContenido = this.miReview.contenido;
            this.nuevaValoracion = this.miReview.valoracion;
          }
          this.loading = false;
        },
        error: () => {
          this.reviews = [];
          this.loading = false;
        },
      });
  }
  

  // Métodos de navegación
  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.cargarReviews(this.currentPage + 1);
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.cargarReviews(this.currentPage - 1);
    }
  }

  irAPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.cargarReviews(page);
    }
  }

  // Calcula el promedio de calificaciones
  get averageRating(): string {
    if (this.totalReviewsCount === 0) return '0.0';
    // Por simplicidad, calculamos con las reviews de la página actual
    const sum = this.reviews.reduce(
      (total, review) => total + review.valoracion,
      0
    );
    return this.reviews.length > 0
      ? (sum / this.reviews.length).toFixed(1)
      : '0.0';
  }

  // Obtiene el número total de reseñas
  get totalReviews(): number {
    return this.totalReviewsCount;
  }

  // Convierte la calificación numérica en estrellas
  getStars(rating: number): string {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    // Añadir estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }

    // Añadir media estrella si corresponde
    if (halfStar) {
      stars += '½';
    }

    return stars;
  }

  escribirResena(): void {
    this.mostrandoFormulario = !this.mostrandoFormulario;
    if (this.miReview && this.mostrandoFormulario) {
      // Si ya tiene una review, cargar sus datos para editar
      this.nuevoContenido = this.miReview.contenido;
      this.nuevaValoracion = this.miReview.valoracion;
    }
  }

  guardarReview(): void {
    if (!this.nuevoContenido.trim()) {
      alert('El contenido no puede estar vacío');
      return;
    }

    if (this.nuevaValoracion < 1 || this.nuevaValoracion > 5) {
      alert('La valoración debe estar entre 1 y 5');
      return;
    }

    if (this.miReview) {
      // Editar
      this.reviewService
        .editarReview(
          this.miReview.id,
          this.nuevoContenido,
          this.libroId,
          this.nuevaValoracion
        )
        .subscribe({
          next: () => {
            this.mostrandoFormulario = false;
            this.cargarReviews();
            alert('Review actualizada');
          },
          error: (error) => {
            console.error('Error completo:', error);
            if (error.status === 422) {
              alert(
                'Error de validación: Revisa que todos los campos sean correctos'
              );
            } else {
              alert('Error al actualizar la review');
            }
          },
        });
    } else {
      // Crear
      this.reviewService
        .crearReview(this.nuevoContenido, this.libroId, this.nuevaValoracion)
        .subscribe({
          next: () => {
            this.cargarReviews();
            this.nuevoContenido = '';
            this.nuevaValoracion = 5;
            this.mostrandoFormulario = false;
            alert('Review creada');
          },
          error: (error) => {
            console.error('Error completo:', error);
            if (error.status === 409) {
              alert('Ya tienes una review creada para este libro.');
            } else if (error.status === 422) {
              alert(
                'Error de validación: Revisa que todos los campos sean correctos'
              );
            } else {
              alert('Error al crear la review');
            }
          },
        });
    }
  }

  cancelarEdicion(): void {
    this.mostrandoFormulario = false;
    this.nuevoContenido = '';
    this.nuevaValoracion = 5;
  }
}
