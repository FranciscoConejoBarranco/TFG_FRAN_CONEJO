import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroDetalles } from '../../shared/interfaces/libro-detalles'; 
import { LibrosRelacionadosComponent } from '../../modules/libros-relacionados/libros-relacionados.component';
import { ReviewComponent } from '../../modules/review/review.component';

@Component({
  selector: 'app-detalles-libro',
  standalone: true,
  imports: [CommonModule, LibrosRelacionadosComponent, ReviewComponent],
  templateUrl: './detalles-libro.component.html',
  styleUrl: './detalles-libro.component.css'
})
export class DetallesLibroComponent {

  selectedBook: LibroDetalles = {
    id: 1,
    title: "El nombre del viento",
    author: "Patrick Rothfuss",
    genre: "Fantasía",
    rating: 4.5,
    description: "Kvothe, un joven músico y mago, relata su transformación de niño de la calle a estudiante de artes mágicas. Una historia épica de aventura, magia y misterio que ha cautivado a lectores de todo el mundo.",
    coverImage: "https://images.pexels.com/photos/6806609/pexels-photo-6806609.jpeg",
    releaseDate: "2007",
    pages: 662,
  };

  relatedBooks: LibroDetalles[] = [
    {
      id: 2,
      title: "El temor de un hombre sabio",
      author: "Patrick Rothfuss",
      coverImage: "https://images.pexels.com/photos/4256852/pexels-photo-4256852.jpeg",
    },
    {
      id: 3,
      title: "El camino de los reyes",
      author: "Brandon Sanderson",
      coverImage: "https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg",
    },
    {
      id: 4,
      title: "Elantris",
      author: "Brandon Sanderson",
      coverImage: "https://images.pexels.com/photos/6806609/pexels-photo-6806609.jpeg",
    },
  ];

  goToLanding(): void {
    window.location.href = '/';
  }
}