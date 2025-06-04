import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { UsuarioService } from '../../shared/services/usuario.service';
import { UsuarioInterface } from '../../shared/interfaces/usuario-interface';

// Angular Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-gestionusuarios',
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
  templateUrl: './gestionusuarios.component.html',
  styleUrls: ['./gestionusuarios.component.css'],
})
export class GestionusuariosComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  private _paginator!: MatPaginator;

  // Configuración mejorada del paginator
  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (this._paginator) {
      this._paginator.page.subscribe((event) => {
        this.currentPage = event.pageIndex + 1;
        this.itemsPerPage = event.pageSize;
        this.cargarUsuarios();
      });
    }
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'roles',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<UsuarioInterface>([]);

  // Estados del componente
  usuarios: UsuarioInterface[] = [];
  rolesDisponibles: string[] = [];
  estadosDisponibles: any[] = [];

  // Filtros
  filtroTexto = '';
  usuarioSeleccionado: UsuarioInterface | null = null;
  mostrarDialogoEditar = false;
  mostrarDialogoEliminar = false;

  // Variables de paginación optimizadas
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  loading = true;

  // Formularios para los diálogos
  usuarioForm: FormGroup;
  usuarioEditando: UsuarioInterface | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.rolesDisponibles = ['ROLE_USER', 'ROLE_SUPERADMIN'];
    
    // Inicializar formulario
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roles: [[]],
      estado: [''],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEstados();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  irAPagina(pagina: number): void {
    console.log('Navegando manualmente a la página:', pagina);
    this.currentPage = pagina;
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService
      .getUsuarios(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          if (response.estado === 'ok') {
            this.usuarios = response.data;
            this.dataSource.data = this.usuarios;
            this.totalItems = response.pagination.totalItems;

            // Actualización segura del paginator
            if (this.paginator) {
              this.paginator.length = this.totalItems;
              this.paginator.pageSize = this.itemsPerPage;
            }
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
        },
      });
  }

  cargarEstados(): void {
    this.usuarioService.getEstados().subscribe({
      next: (response) => {
        if (response.estado === 'ok') {
          this.estadosDisponibles = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar estados:', error);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.cargarUsuarios();
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Métodos para manejar el diálogo de edición
  editarUsuario(usuario: UsuarioInterface): void {
    this.usuarioEditando = { ...usuario };
    this.usuarioForm.patchValue({
      name: usuario.name,
      email: usuario.email,
      roles: usuario.roles,
      estado: usuario.estado,
    });
    this.mostrarDialogoEditar = true;
  }

  cerrarDialogoEditar(): void {
    this.mostrarDialogoEditar = false;
    this.usuarioEditando = null;
    this.usuarioForm.reset();
  }

  guardarUsuario(): void {
    if (this.usuarioForm.valid && this.usuarioEditando) {
      const formValue = this.usuarioForm.value;
      // Si el backend espera un array, asegúrate de que 'roles' sea un array:
      formValue.roles = [formValue.roles];
      this.actualizarUsuario(this.usuarioEditando.id, formValue);
      this.cerrarDialogoEditar();
    }
  }

  actualizarUsuario(id: number, datos: Partial<UsuarioInterface>): void {
    this.usuarioService.actualizarUsuario(id, datos).subscribe({
      next: (response) => {
        if (response.estado === 'ok') {
          this.mostrarMensaje('Usuario actualizado correctamente', 'success');
          this.cargarUsuarios();
        }
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.mostrarMensaje('Error al actualizar usuario', 'error');
      },
    });
  }

  // Métodos para manejar el diálogo de eliminación
  eliminarUsuario(usuario: UsuarioInterface): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarDialogoEliminar = true;
  }

  cerrarDialogoEliminar(): void {
    this.mostrarDialogoEliminar = false;
    this.usuarioSeleccionado = null;
  }

  confirmarEliminacion(): void {
    if (this.usuarioSeleccionado) {
      this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.id).subscribe({
        next: (response) => {
          if (response.estado === 'ok') {
            this.mostrarMensaje('Usuario eliminado correctamente', 'success');
            this.cargarUsuarios();
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.mostrarMensaje('Error al eliminar usuario', 'error');
        },
      });
    }
    this.cerrarDialogoEliminar();
  }

  cambiarRol(usuario: UsuarioInterface, nuevoRol: string): void {
    this.usuarioService.cambiarRolUsuario(usuario.id, nuevoRol).subscribe({
      next: (response) => {
        if (response.estado === 'ok') {
          this.mostrarMensaje('Rol actualizado correctamente', 'success');
          this.cargarUsuarios();
        }
      },
      error: (error) => {
        console.error('Error al cambiar rol:', error);
        this.mostrarMensaje('Error al cambiar rol', 'error');
      },
    });
  }

  obtenerColorRol(roles: string[]): string {
    const rol = roles[0] || 'ROLE_USER';
    const colores: { [key: string]: string } = {
      ROLE_USER: 'bg-blue-500',
      ROLE_SUPERADMIN: 'bg-red-500',
    };
    return colores[rol] || 'bg-gray-500';
  }

  obtenerNombreRol(roles: string[]): string {
    return this.usuarioService.getNombreRol(roles[0] || 'ROLE_USER');
  }

  getNombreRol(rol: string): string {
    return this.usuarioService.getNombreRol(rol);
  }

  obtenerColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      Verificado: 'bg-green-500',
      Pendiente: 'bg-yellow-500',
    };
    return colores[estado] || 'bg-gray-500';
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }

  exportarUsuarios(): void {
    console.log('Exportando usuarios...');
    this.mostrarMensaje(
      'Funcionalidad de exportación en desarrollo',
      'success'
    );
  }

  refrescarDatos(): void {
    this.cargarUsuarios();
    this.mostrarMensaje('Datos actualizados', 'success');
  }
}