import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { RouterModule } from '@angular/router';
import { ListaLecturaService } from '../../shared/services/lista-lectura.service';
import { ListaLecturaInterface } from '../../shared/interfaces/lista-lectura.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-mislistas',
  standalone: true,
  imports: [
    CommonModule,
    NavbarDashboardComponent,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './mislistas.component.html',
  styleUrls: ['./mislistas.component.css']
})
export class MislistasComponent implements OnInit {
  listas: ListaLecturaInterface[] = [];
  cargando = true;
  listaExpandida: number | null = null;
  detalleLista!: ListaLecturaInterface;

  constructor(
    private listaLecturaService: ListaLecturaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.cargarListas(); // 🔥 Esto es lo que faltaba

  }

  cargarListas(): void {
    this.cargando = true;
    this.listaLecturaService.obtenerListas().subscribe({
      next: (listas) => {
        console.log('Listas recibidas:', listas);
        this.listas = listas;
        this.cargando = false;
  
        // Para cada lista, obtener su detalle
        this.listas.forEach((lista, index) => {
          this.listaLecturaService.obtenerDetalle(lista.id).subscribe((detalle) => {
            this.listas[index].libros = detalle.libros;
  
            // Debug por si querés ver que se asignaron bien
            console.log(`Detalles de la lista ${lista.nombre}:`, detalle.libros);
          });
        });
      },
      error: (error) => {
        console.error('Error al cargar listas:', error);
        this.snackBar.open('Error al cargar listas', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }
  

  toggleLista(id: number): void {
    console.log('Toggle lista:', id);
    console.log('Lista expandida anterior:', this.listaExpandida);
    this.listaExpandida = this.listaExpandida === id ? null : id;
    console.log('Lista expandida nueva:', this.listaExpandida);
    
    // Debug: mostrar libros de la lista seleccionada
    const lista = this.listas.find(l => l.id === id);
    if (lista) {
      console.log('Libros en lista seleccionada:', lista.libros);
    }
  }

  eliminarLibro(listaId: number, libroId: number): void {
    if (confirm('¿Seguro que quieres eliminar este libro de la lista?')) {
      this.listaLecturaService.eliminarLibroDeLista(listaId, libroId).subscribe({
        next: () => {
          const lista = this.listas.find(l => l.id === listaId);
          if (lista && lista.libros) {
            lista.libros = lista.libros.filter(l => l.libroId !== libroId);
          }
          this.snackBar.open('Libro eliminado', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar libro', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }

  eliminarLista(id: number): void {
    if (confirm('¿Seguro que quieres eliminar esta lista?')) {
      this.listaLecturaService.eliminarLista(id).subscribe({
        next: () => {
          this.listas = this.listas.filter(l => l.id !== id);
          this.snackBar.open('Lista eliminada', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar lista', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }

  // Método trackBy para optimizar el *ngFor
  trackByLibro(index: number, libro: any): any {
    return libro.libroId || index;
  }

  // Método trackBy para las listas
  trackByLista(index: number, lista: ListaLecturaInterface): any {
    return lista.id || index;
  }
}