import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../shared/services/review.service';

import { ReviewInterface } from '../../shared/interfaces/review';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';


// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-gestionreviews',
  templateUrl: './gestionreviews.component.html',
  styleUrls: ['./gestionreviews.component.css'],
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class GestionreviewsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id', 'libro', 'contenido', 'valoracion', 'fecha', 'acciones'
  ];
  dataSource = new MatTableDataSource<ReviewInterface>([]);

  reviews: ReviewInterface[] = [];
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  loading = true;

  editandoReview: any = null;

  // Formulario y estados para editar
  reviewForm: FormGroup;
  reviewEditando: ReviewInterface | null = null;
  mostrarDialogoEditar = false;
  mostrarDialogoEliminar = false;
  reviewSeleccionada: ReviewInterface | null = null;

  constructor(
    private reviewService: ReviewService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      contenido: ['', [Validators.required]],
      valoracion: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.cargarReviews();
  }

  cargarReviews(): void {
    this.loading = true;
    console.log('Cargando reviews, página:', this.currentPage, 'items por página:', this.itemsPerPage);
    this.reviewService.obtenerTodasReviews(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Respuesta recibida:', response);
          this.reviews = response.reviews;
          this.dataSource.data = this.reviews;
          this.totalItems = response.pagination.totalReviews;
          this.loading = false;
          console.log('Reviews cargadas:', this.reviews.length, this.reviews);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al cargar reviews:', error);
        }
      });
}


  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.cargarReviews();
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarReview(review: ReviewInterface): void {
    console.log('Review recibida para editar:', review);
    this.reviewEditando = { ...review };
    this.reviewForm.patchValue({
      contenido: review.contenido,
      valoracion: review.valoracion,
    });
    this.mostrarDialogoEditar = true;
  }

  cerrarDialogoEditar(): void {
    this.mostrarDialogoEditar = false;
    this.reviewEditando = null;
    this.reviewForm.reset();
  }

  guardarReview(): void {
    if (!this.reviewEditando) return;
  
    const { contenido, valoracion } = this.reviewForm.value;
    console.log('Guardando review:', this.reviewEditando.id, contenido, this.reviewEditando.libro.id, valoracion);
  
    this.reviewService.editarReview(
      this.reviewEditando.id,
      contenido,
      this.reviewEditando.libro.id,
      valoracion
    ).subscribe({
      next: () => {
        this.mostrarMensaje('Review actualizada correctamente', 'success');
        this.cargarReviews();
        this.cerrarDialogoEditar();
      },
      error: (error) => {
        console.error('Error al editar review:', error);
        this.mostrarMensaje('Error al actualizar review', 'error');
      }
    });
  }
  

  eliminarReview(review: ReviewInterface): void {
    this.reviewSeleccionada = review;
    this.mostrarDialogoEliminar = true;
  }

  cerrarDialogoEliminar(): void {
    this.mostrarDialogoEliminar = false;
    this.reviewSeleccionada = null;
  }

  confirmarEliminacion(): void {
    if (this.reviewSeleccionada) {
      this.reviewService.eliminarReview(this.reviewSeleccionada.id).subscribe({
        next: () => {
          this.mostrarMensaje('Review eliminada correctamente', 'success');
          this.cargarReviews();
        },
        error: () => {
          this.mostrarMensaje('Error al eliminar review', 'error');
        }
      });
    }
    this.cerrarDialogoEliminar();
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }
}
