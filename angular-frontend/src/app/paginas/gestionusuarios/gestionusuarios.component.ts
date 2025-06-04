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
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Inject } from '@angular/core';

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
    MatDialogModule,
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
    // this.dataSource.paginator = this._paginator;
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
  // Removed duplicate declaration of 'loading'
  usuarios: UsuarioInterface[] = [];
  rolesDisponibles: string[] = [];
  estadosDisponibles: any[] = [];

  // Filtros
  filtroTexto = '';
  usuarioSeleccionado: UsuarioInterface | null = null;
  mostrarDialogoEditar = false;
  mostrarDialogoEliminar = false;

  /// Variables de paginación optimizadas
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  loading = true;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.rolesDisponibles = ['ROLE_USER', 'ROLE_SUPERADMIN'];
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

  editarUsuario(usuario: UsuarioInterface): void {
    const dialogRef = this.dialog.open(EditarUsuarioDialogComponent, {
      width: '500px',
      data: {
        usuario: { ...usuario },
        rolesDisponibles: this.rolesDisponibles,
        estadosDisponibles: this.estadosDisponibles,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.actualizarUsuario(usuario.id, result);
      }
    });
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

  eliminarUsuario(usuario: UsuarioInterface): void {
    const dialogRef = this.dialog.open(ConfirmarEliminacionDialogComponent, {
      width: '400px',
      data: { usuario },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
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
    });
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

// Componente de diálogo para editar usuario
@Component({
  selector: 'app-editar-usuario-dialog',
  template: `
    <h2 mat-dialog-title class="text-xl font-semibold mb-4">Editar Usuario</h2>
    <mat-dialog-content class="min-w-96">
      <form [formGroup]="usuarioForm" class="space-y-4">
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Nombre</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Nombre del usuario"
          />
          <mat-error *ngIf="usuarioForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Email</mat-label>
          <input
            matInput
            formControlName="email"
            type="email"
            placeholder="correo@ejemplo.com"
          />
          <mat-error *ngIf="usuarioForm.get('email')?.hasError('required')">
            El email es requerido
          </mat-error>
          <mat-error *ngIf="usuarioForm.get('email')?.hasError('email')">
            Email inválido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="roles">
            <mat-option
              *ngFor="let rol of data.rolesDisponibles"
              [value]="[rol]"
            >
              {{ getNombreRol(rol) }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="gap-2">
      <button mat-button (click)="onNoClick()" class="text-gray-600">
        Cancelar
      </button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!usuarioForm.valid"
        (click)="onSave()"
      >
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class EditarUsuarioDialogComponent {
  usuarioForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.usuarioForm = this.fb.group({
      name: [data.usuario.name, [Validators.required]],
      email: [data.usuario.email, [Validators.required, Validators.email]],
      roles: [data.usuario.roles],
      estado: [data.usuario.estado],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.usuarioForm.valid) {
      this.dialogRef.close(this.usuarioForm.value);
    }
  }

  getNombreRol(rol: string): string {
    return this.usuarioService.getNombreRol(rol);
  }
}

// Componente de diálogo para confirmar eliminación
@Component({
  selector: 'app-confirmar-eliminacion-dialog',
  template: `
    <h2 mat-dialog-title class="text-xl font-semibold text-red-600">
      Confirmar Eliminación
    </h2>
    <mat-dialog-content class="py-4">
      <p class="text-gray-700">
        ¿Estás seguro de que deseas eliminar al usuario
        <strong class="text-gray-900">{{ data.usuario.name }}</strong
        >?
      </p>
      <p class="text-red-600 text-sm mt-2 font-medium">
        ⚠️ Esta acción no se puede deshacer.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="gap-2">
      <button mat-button (click)="onNoClick()" class="text-gray-600">
        Cancelar
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Eliminar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmarEliminacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
