import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';
import { LibroService } from '../../shared/services/libroservice';
import { LibroInterface } from '../../shared/interfaces/libro-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-usuario',
  templateUrl: './dashboard-usuario.component.html',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  styles: [
    `
      .scrollable-container::-webkit-scrollbar {
        height: 8px;
      }
      .scrollable-container::-webkit-scrollbar-track {
        background: #333;
      }
      .scrollable-container::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 4px;
      }
      .book-card:hover {
        transform: scale(1.02);
      }
      .gradient-text {
        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .empty-state {
        background: rgba(255, 255, 255, 0.05);
        border: 2px dashed rgba(255, 255, 255, 0.2);
      }
    `,
  ],
})
export class DashboardUsuarioComponent implements OnInit {
  usuario: any = null;
  libroAleatorio: LibroInterface | null = null;
  librosRecomendados: LibroInterface[] = [];
  loading = true;
  loadingNuevosLibros = false;
  horaDelDia = '';
  mensajePersonalizado = '';

  // Generar IDs automáticamente desde 29 hasta 77
  idsLibrosDisponibles: number[] = [];

  // Frases motivacionales para lectores
  frasesLectura = [
    'Un libro es un sueño que tienes en tus manos',
    'La lectura es el viaje más hermoso que puedes hacer',
    'Cada página es una nueva aventura esperando',
    'Los libros son la puerta a mundos infinitos',
    'Hoy es un buen día para perderse en una historia',
    'Un día sin leer es un día perdido',
    'Los libros son amigos que nunca te decepcionan',
    'Leer es soñar con los ojos abiertos',
  ];

  constructor(
    private authService: AuthService,
    private libroService: LibroService,
    private router: Router
  ) {
    // Generar array de IDs desde 29 hasta 77
    this.generarIdsDisponibles();
  }

  ngOnInit(): void {
    this.establecerHoraDelDia();
    this.cargarDatosUsuario();
    this.cargarLibrosDesdeBaseDatos();
  }

  generarIdsDisponibles(): void {
    // Crear array desde ID 29 hasta 77
    for (let i = 29; i <= 77; i++) {
      this.idsLibrosDisponibles.push(i);
    }
    console.log(
      `IDs generados: ${this.idsLibrosDisponibles.length} libros disponibles (ID 29-77)`
    );
  }

  establecerHoraDelDia(): void {
    const hora = new Date().getHours();
    if (hora < 12) {
      this.horaDelDia = 'Buenos días';
    } else if (hora < 18) {
      this.horaDelDia = 'Buenas tardes';
    } else {
      this.horaDelDia = 'Buenas noches';
    }
  }

  cargarDatosUsuario(): void {
    this.authService.fetchUser().subscribe({
      next: (user) => {
        this.usuario = user;
        this.generarMensajePersonalizado();
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.usuario = { name: 'Usuario' };
        this.generarMensajePersonalizado();
      },
    });
  }

  generarMensajePersonalizado(): void {
    const fraseAleatoria =
      this.frasesLectura[Math.floor(Math.random() * this.frasesLectura.length)];
    this.mensajePersonalizado = fraseAleatoria;
  }

  cargarLibrosDesdeBaseDatos(): void {
    // Obtener 6 IDs aleatorios del rango 29-77
    const idsAleatorios = this.obtenerIdsAleatorios(4);
    console.log('Cargando libros con IDs:', idsAleatorios);

    // Cargar libros usando tu servicio existente
    this.cargarLibrosPorIds(idsAleatorios);
  }

  obtenerIdsAleatorios(cantidad: number): number[] {
    // Barajar el array completo y tomar la cantidad solicitada
    const idsBarajados = [...this.idsLibrosDisponibles].sort(
      () => 0.5 - Math.random()
    );
    return idsBarajados.slice(0, cantidad);
  }

  cargarLibrosPorIds(ids: number[]): void {
    const librosPromises = ids.map((id) =>
      this.libroService
        .libroPorId(id)
        .toPromise()
        .catch((error) => {
          console.log(`Libro con ID ${id} no encontrado en la base de datos`);
          return null;
        })
    );

    Promise.all(librosPromises)
      .then((resultados) => {
        // Filtrar libros que existen (no son null)
        const librosExistentes = resultados.filter(
          (libro) => libro !== null
        ) as LibroInterface[];

        console.log(
          `Libros cargados exitosamente: ${librosExistentes.length} de ${ids.length} solicitados`
        );

        if (librosExistentes.length > 0) {
          this.librosRecomendados = librosExistentes;
          this.libroAleatorio =
            librosExistentes[
              Math.floor(Math.random() * librosExistentes.length)
            ];
        } else {
          // Si no hay libros, mostrar estado vacío
          this.librosRecomendados = [];
          this.libroAleatorio = null;
          console.warn('No se encontraron libros en el rango de IDs 29-77');
        }

        this.loading = false;
      })
      .catch((error) => {
        console.error('Error al cargar libros:', error);
        this.librosRecomendados = [];
        this.libroAleatorio = null;
        this.loading = false;
      });
  }

  cambiarRecomendaciones(): void {
    this.loadingNuevosLibros = true;

    // Obtener nuevos 6 IDs aleatorios del rango
    const nuevosIds = this.obtenerIdsAleatorios(4);
    console.log('Cambiando a nuevos libros con IDs:', nuevosIds);

    const librosPromises = nuevosIds.map((id) =>
      this.libroService
        .libroPorId(id)
        .toPromise()
        .catch((error) => {
          console.log(`Libro con ID ${id} no encontrado`);
          return null;
        })
    );

    Promise.all(librosPromises)
      .then((resultados) => {
        const librosExistentes = resultados.filter(
          (libro) => libro !== null
        ) as LibroInterface[];

        if (librosExistentes.length > 0) {
          this.librosRecomendados = librosExistentes;
          this.libroAleatorio =
            librosExistentes[
              Math.floor(Math.random() * librosExistentes.length)
            ];
          console.log(
            `Nuevas recomendaciones cargadas: ${librosExistentes.length} libros`
          );
        }

        this.loadingNuevosLibros = false;
      })
      .catch((error) => {
        console.error('Error al cambiar recomendaciones:', error);
        this.loadingNuevosLibros = false;
      });
  }

  buscarLibroPorTitulo(titulo: string): void {
    this.libroService.buscarLibro(titulo).subscribe({
      next: (libro) => {
        // Agregar el libro encontrado a las recomendaciones si no está ya
        const yaExiste = this.librosRecomendados.some((l) => l.id === libro.id);
        if (!yaExiste) {
          this.librosRecomendados.unshift(libro);
          // Mantener solo 6 libros
          if (this.librosRecomendados.length > 6) {
            this.librosRecomendados = this.librosRecomendados.slice(0, 6);
          }
        }
        this.libroAleatorio = libro;
      },
      error: (error) => {
        console.error('Error al buscar libro:', error);
      },
    });
  }

  getEstadisticasPersonalizadas(): any {
    const horaActual = new Date().getHours();
    let recomendacion = '';

    if (horaActual < 10) {
      recomendacion = 'Perfecto momento para comenzar el día con una lectura';
    } else if (horaActual < 14) {
      recomendacion = 'Un buen libro para acompañar tu mañana';
    } else if (horaActual < 18) {
      recomendacion = 'Ideal para una pausa de lectura en la tarde';
    } else {
      recomendacion = 'Perfecto para relajarte con una buena historia';
    }

    return { recomendacion };
  }

  trackByBook(index: number, book: LibroInterface): number {
    return book.id;
  }

  Math = Math;

  // Agregar este método
  verDetalles(titulo: string): void {
    this.router.navigate(['/detalles'], {
      queryParams: { titulo: titulo },
    });
  }
}
