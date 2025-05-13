import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resena } from '../../shared/interfaces/review';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  // Datos de reseñas
  reviews: Resena[] = [
    {
      user: "María García",
      rating: 5,
      date: "10/04/2025",
      comment: "Una obra maestra de la fantasía moderna. La narrativa de Rothfuss es hipnótica y los personajes están perfectamente desarrollados. Imposible dejar de leer."
    },
    {
      user: "Carlos Rodríguez",
      rating: 4,
      date: "02/03/2025",
      comment: "Me encantó la construcción del mundo y el sistema de magia. Solo le quito una estrella porque la espera para el tercer libro es demasiado larga."
    },
    {
      user: "Laura Martínez",
      rating: 5,
      date: "15/02/2025",
      comment: "Simplemente perfecto. La prosa es poética y la historia te atrapa desde la primera página. Uno de los mejores libros que he leído en años."
    }
  ];

  // Calcula el promedio de calificaciones
  get averageRating(): string {
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
  }

  // Obtiene el número total de reseñas
  get totalReviews(): number {
    return this.reviews.length;
  }

  // Convierte la calificación numérica en estrellas
  getStars(rating: number): string {
    let stars = "";
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    // Añadir estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars += "★";
    }
    
    // Añadir media estrella si corresponde
    if (halfStar) {
      stars += "½";
    }
    
    return stars;
  }

  escribirResena(): void {
    // Implementar lógica para abrir formulario de reseña
    console.log('Abrir formulario de reseña');
  }
}