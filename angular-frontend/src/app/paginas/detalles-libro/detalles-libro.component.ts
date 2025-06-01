import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroDetalles } from '../../shared/interfaces/libro-detalles';
import { LibrosRelacionadosComponent } from '../../modules/libros-relacionados/libros-relacionados.component';
import { ReviewComponent } from '../../modules/review/review.component';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { LibroService } from '../../shared/services/libroservice';
import { LibroInterface } from '../../shared/interfaces/libro-interface';

@Component({
  selector: 'app-detalles-libro',
  standalone: true,
  imports: [CommonModule, ReviewComponent, RouterModule],
  templateUrl: './detalles-libro.component.html',
  styleUrl: './detalles-libro.component.css',
})
export class DetallesLibroComponent implements OnInit {
  selectedBook!: LibroInterface;
  relatedBooks: LibroInterface[] = [];

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const titulo = params['titulo'];

      if (titulo) {
        this.libroService.buscarLibro(titulo).subscribe({
          next: (libro) => {
            this.selectedBook = libro;
          },
          error: () => {
            console.error('Libro no encontrado');
            // Aquí podrías redirigir o mostrar un mensaje
          },
        });
      }
    });
  }


  getAmazonLink(titulo: string): string {
    // Convierte el título en un slug tipo "padre-rico-padre-pobre"
    const slug = titulo
      .toLowerCase()
      .normalize('NFD')                   // Quita acentos
      .replace(/[\u0300-\u036f]/g, '')    // Regex para quitar los diacríticos
      .replace(/[^a-z0-9\s-]/g, '')       // Quita caracteres especiales
      .replace(/\s+/g, '-')               // Sustituye espacios por guiones
      .replace(/-+/g, '-')                // Limpia guiones duplicados
      .trim();
  
    return `https://www.amazon.es/s?k=${slug}&tag=tuaffid-21`;
  }

  goToLanding(): void {
    window.location.href = '/';
  }
}
