import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';
import { LibroService } from '../../shared/services/libroservice';
import { LibroInterface } from '../../shared/interfaces/libro-interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent, RouterModule],
  styles: [`
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
      background: linear-gradient(45deg, #8b5cf6, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .admin-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stats-admin {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    .empty-state {
      background: rgba(255, 255, 255, 0.05);
      border: 2px dashed rgba(255, 255, 255, 0.2);
    }
  `]
})
export class DashboardAdminComponent implements OnInit {
  usuario: any = null;
  libroAleatorio: LibroInterface | null = null;
  librosRecomendados: LibroInterface[] = [];
  estadisticasAdmin: any = {};
  loading = true;
  loadingNuevosLibros = false;
  horaDelDia = '';
  mensajePersonalizado = '';

  // Generar IDs automáticamente desde 29 hasta 77
  idsLibrosDisponibles: number[] = [];

  // Frases específicas para administradores
  frasesAdmin = [
    'Gestiona tu biblioteca con sabiduría',
    'Cada libro agregado es una nueva oportunidad',
    'Tu trabajo hace posible que otros descubran historias',
    'Administrar contenido es crear experiencias',
    'La organización es la clave del éxito',
    'Tu dedicación construye la mejor biblioteca digital',
    'Cada decisión impacta la experiencia del usuario',
    'El conocimiento bien organizado es poder',
    'Facilitas el acceso al conocimiento para todos'
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
    this.cargarEstadisticasAdmin();
  }

  generarIdsDisponibles(): void {
    // Crear array desde ID 29 hasta 77
    for (let i = 29; i <= 77; i++) {
      this.idsLibrosDisponibles.push(i);
    }
    console.log(`IDs generados para admin: ${this.idsLibrosDisponibles.length} libros disponibles (ID 29-77)`);
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
        console.error('Error al cargar usuario admin:', error);
        this.usuario = { name: 'Admin' };
        this.generarMensajePersonalizado();
      }
    });
  }

  generarMensajePersonalizado(): void {
    const fraseAleatoria = this.frasesAdmin[Math.floor(Math.random() * this.frasesAdmin.length)];
    this.mensajePersonalizado = fraseAleatoria;
  }

  cargarLibrosDesdeBaseDatos(): void {
    // Obtener 4 IDs aleatorios del rango 29-77
    const idsAleatorios = this.obtenerIdsAleatorios(4);
    console.log('Admin cargando libros con IDs:', idsAleatorios);
    
    // Cargar libros usando el servicio existente
    this.cargarLibrosPorIds(idsAleatorios);
  }

  cargarEstadisticasAdmin(): void {
    // Generar estadísticas simuladas para el admin
    this.estadisticasAdmin = {
      totalLibros: this.idsLibrosDisponibles.length,
      librosAgregadosHoy: Math.floor(Math.random() * 5) + 1,
      usuariosActivos: Math.floor(Math.random() * 50) + 20,
      busquedasRecientes: Math.floor(Math.random() * 100) + 50
    };
    console.log('Estadísticas admin cargadas:', this.estadisticasAdmin);
  }

  obtenerIdsAleatorios(cantidad: number): number[] {
    // Barajar el array completo y tomar la cantidad solicitada
    const idsBarajados = [...this.idsLibrosDisponibles].sort(() => 0.5 - Math.random());
    return idsBarajados.slice(0, cantidad);
  }

  cargarLibrosPorIds(ids: number[]): void {
    const librosPromises = ids.map(id => 
      this.libroService.libroPorId(id).toPromise().catch(error => {
        console.log(`Libro con ID ${id} no encontrado en la base de datos`);
        return null;
      })
    );

    Promise.all(librosPromises).then(resultados => {
      // Filtrar libros que existen (no son null)
      const librosExistentes = resultados.filter(libro => libro !== null) as LibroInterface[];
      
      console.log(`Admin - Libros cargados exitosamente: ${librosExistentes.length} de ${ids.length} solicitados`);
      
      if (librosExistentes.length > 0) {
        this.librosRecomendados = librosExistentes;
        this.libroAleatorio = librosExistentes[Math.floor(Math.random() * librosExistentes.length)];
      } else {
        // Si no hay libros, mostrar estado vacío
        this.librosRecomendados = [];
        this.libroAleatorio = null;
        console.warn('Admin - No se encontraron libros en el rango de IDs 29-77');
      }
      
      this.loading = false;
    }).catch(error => {
      console.error('Error al cargar libros en admin:', error);
      this.librosRecomendados = [];
      this.libroAleatorio = null;
      this.loading = false;
    });
  }

  cambiarRecomendaciones(): void {
    this.loadingNuevosLibros = true;
    
    // Obtener nuevos 4 IDs aleatorios del rango
    const nuevosIds = this.obtenerIdsAleatorios(4);
    console.log('Admin cambiando a nuevos libros con IDs:', nuevosIds);
    
    const librosPromises = nuevosIds.map(id => 
      this.libroService.libroPorId(id).toPromise().catch(error => {
        console.log(`Libro con ID ${id} no encontrado`);
        return null;
      })
    );

    Promise.all(librosPromises).then(resultados => {
      const librosExistentes = resultados.filter(libro => libro !== null) as LibroInterface[];
      
      if (librosExistentes.length > 0) {
        this.librosRecomendados = librosExistentes;
        this.libroAleatorio = librosExistentes[Math.floor(Math.random() * librosExistentes.length)];
        console.log(`Admin - Nuevas recomendaciones cargadas: ${librosExistentes.length} libros`);
      }
      
      this.loadingNuevosLibros = false;
    }).catch(error => {
      console.error('Error al cambiar recomendaciones en admin:', error);
      this.loadingNuevosLibros = false;
    });
  }



  verDetalles(titulo: string): void {
    console.log(`Admin viendo detalles del libro: ${titulo}`);
    this.router.navigate(['/detalles'], {
      queryParams: { titulo: titulo }
    });
  }

  buscarLibroPorTitulo(titulo: string): void {
    this.libroService.buscarLibro(titulo).subscribe({
      next: (libro) => {
        // Agregar el libro encontrado a las recomendaciones si no está ya
        const yaExiste = this.librosRecomendados.some(l => l.id === libro.id);
        if (!yaExiste) {
          this.librosRecomendados.unshift(libro);
          // Mantener solo 4 libros
          if (this.librosRecomendados.length > 4) {
            this.librosRecomendados = this.librosRecomendados.slice(0, 4);
          }
        }
        this.libroAleatorio = libro;
        console.log('Admin - Libro encontrado y agregado:', libro.titulo);
      },
      error: (error) => {
        console.error('Error al buscar libro en admin:', error);
      }
    });
  }

  getEstadisticasPersonalizadas(): any {
    const horaActual = new Date().getHours();
    let recomendacion = '';
    
    if (horaActual < 10) {
      recomendacion = 'Perfecto momento para revisar el sistema y planificar el día';
    } else if (horaActual < 14) {
      recomendacion = 'Hora ideal para gestionar contenido y usuarios';
    } else if (horaActual < 18) {
      recomendacion = 'Momento perfecto para revisar estadísticas y métricas';
    } else {
      recomendacion = 'Tiempo ideal para planificar mejoras y actualizaciones';
    }

    return { recomendacion };
  }

  trackByBook(index: number, book: LibroInterface): number {
    return book.id;
  }

  // Método para refrescar estadísticas
  refrescarEstadisticas(): void {
    this.cargarEstadisticasAdmin();
    console.log('Estadísticas admin refrescadas');
  }

  // Método para exportar datos (placeholder)
  exportarDatos(): void {
    console.log('Exportando datos del sistema...');
    // Aquí implementarías la lógica de exportación
  }

  // Método para hacer backup (placeholder)
  hacerBackup(): void {
    console.log('Iniciando backup del sistema...');
    // Aquí implementarías la lógica de backup
  }

  Math = Math;
}
