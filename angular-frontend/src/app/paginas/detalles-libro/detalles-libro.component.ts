import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LibroService } from '../../shared/services/libroservice';
import { ListaLecturaService } from '../../shared/services/lista-lectura.service';
import { LibroInterface } from '../../shared/interfaces/libro-interface';
import { ListaLecturaInterface } from '../../shared/interfaces/lista-lectura.interface';
import { ReviewComponent } from '../../modules/review/review.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalles-libro',
  standalone: true,
  imports: [CommonModule, ReviewComponent, RouterModule, FormsModule],
  templateUrl: './detalles-libro.component.html',
  styleUrl: './detalles-libro.component.css',
})
export class DetallesLibroComponent implements OnInit {
  selectedBook!: LibroInterface;
  relatedBooks: LibroInterface[] = [];

  listas: ListaLecturaInterface[] = [];
  mostrarMenuListas = false;
  nuevaListaNombre = '';

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private listaLecturaService: ListaLecturaService
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
          },
        });
      }
    });
  }

  getAmazonLink(titulo: string): string {
    const slug = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return `https://www.amazon.es/s?k=${slug}&tag=tuaffid-21`;
  }

  goToLanding(): void {
    window.location.href = '/';
  }

  onClickMiLista(): void {
    this.listaLecturaService.obtenerListas().subscribe({
      next: (listas) => {
        this.listas = listas;
        this.mostrarMenuListas = true;
      },
      error: () => {
        console.error('Error al cargar listas');
      },
    });
  }

  agregarLibroALista(listaId: number): void {
    const libroId = this.selectedBook.id;
    const estadoLectura = 'pendiente'; // O lo que corresponda (puede venir de un selector)
  
    this.listaLecturaService.agregarLibroALista(listaId, libroId, estadoLectura).subscribe({
      next: () => {
        this.mostrarMenuListas = false;
        alert('Libro añadido a la lista');
      },
      error: (error) => {
        console.error(error);
        if (error.status === 409) {
          alert(' Este libro ya está en la lista.');
        } else {
          alert(' Error al añadir el libro a la lista.');
        }
      },
    });
  }
  
  crearNuevaLista(): void {
    if (!this.nuevaListaNombre.trim()) {
      alert('El nombre de la lista no puede estar vacío');
      return;
    }
  
    const nuevaLista: ListaLecturaInterface = {
      id: 0, // El backend debe asignar un ID
      nombre: this.nuevaListaNombre,
      libros: [{
        libroId: this.selectedBook.id,
        titulo: this.selectedBook.titulo,
        estadoLectura: 'pendiente' // o lo que quieras por defecto
      }],
      fechaCreacion: new Date().toISOString(), // Fecha actual
      usuario: 0 // Reemplazar con el ID numérico del usuario actual si está disponible
    };
  
    this.listaLecturaService.crearLista(nuevaLista.nombre).subscribe({
      next: (listaCreada) => {
        this.listas.push(listaCreada);
        this.mostrarMenuListas = false;
        this.nuevaListaNombre = '';
        alert('Lista creada y libro añadido');
      },
      error: () => {
        alert('Error al crear la lista');
      },
    });
  }
  
}
