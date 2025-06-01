import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LibroInterface } from '../../shared/interfaces/libro-interface';
import { LibroService } from '../../shared/services/libroservice';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnDestroy {
  @Input() searchQuery: string = '';
  @Input() books: LibroInterface[] = [];

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() bookFound = new EventEmitter<LibroInterface>();

  searchControl = new FormControl('');
  libroEncontrado?: LibroInterface;
  mensajeError: string = '';

  private destroy$ = new Subject<void>();

  constructor(private libroService: LibroService, private router: Router) {
    this.searchControl = new FormControl('');

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.searchQuery = value ?? '';
        this.searchQueryChange.emit(this.searchQuery);
        // Aquí NO lanzamos búsqueda
      });
  }

  buscarLibro(query: string) {
    if (!query.trim()) {
      this.libroEncontrado = undefined;
      this.mensajeError = '';
      return;
    }

    this.libroService.buscarLibro(query).subscribe({
      next: (libro) => {
        this.libroEncontrado = libro;
        this.mensajeError = '';
        this.bookFound.emit(libro);
      },
      error: () => {
        this.libroEncontrado = undefined;
        this.mensajeError = '❌ No se encontró el libro';
      }
    });
  }

  ejecutarBusqueda() {
    const query = this.searchControl.value?.trim() ?? '';
    if (query.length < 3) {
      this.mensajeError = 'Escribe al menos 3 letras';
      return;
    }
  
    this.buscarLibro(query);
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  verDetalles(titulo: string): void {
    this.router.navigate(['/detalles'], {
      queryParams: { titulo: titulo }
    });
  }
}
