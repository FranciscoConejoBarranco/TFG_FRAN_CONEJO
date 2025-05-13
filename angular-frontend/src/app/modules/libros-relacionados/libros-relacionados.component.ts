import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroDetalles } from '../../shared/interfaces/libro-detalles';

@Component({
  selector: 'app-libros-relacionados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libros-relacionados.component.html',
  styleUrl: './libros-relacionados.component.css'
})
export class LibrosRelacionadosComponent {
  @Input() relatedBooks: LibroDetalles[] = [];

  trackByBook(index: number, book: LibroDetalles): number {
    return book.id;
  }
}