import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibroService } from '../../shared/services/libroservice';
import { LibroInterface } from '../../shared/interfaces/libro-interface';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-gestionlibros',
  templateUrl: './gestionlibros.component.html',
  styleUrls: ['./gestionlibros.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarDashboardComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ]
})
export class GestionLibrosComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'titulo', 'autor', 'acciones'];
  dataSource = new MatTableDataSource<LibroInterface>([]);

  libros: LibroInterface[] = [];
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  loading = true;

  constructor(
    private libroService: LibroService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.loading = true;
    this.libroService.listarLibros().subscribe({
      next: (libros) => {
        this.libros = libros;
        this.totalItems = libros.length;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.dataSource.data = libros.slice(startIndex, endIndex);
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.mostrarMensaje('Error al cargar libros', 'error');
        console.error('Error al cargar libros:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.cargarLibros();
  }

  eliminarLibro(libro: LibroInterface): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el libro "${libro.titulo}"?`)) {
      this.libroService.eliminarLibro(libro.id).subscribe({
        next: () => {
          this.mostrarMensaje('Libro eliminado correctamente', 'success');
          this.cargarLibros();
        },
        error: () => {
          this.mostrarMensaje('Error al eliminar libro', 'error');
        }
      });
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
