import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  loading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    // Usar el método existente del AuthService
    this.authService.fetchUser().subscribe({
      next: (user) => {
        this.usuario = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.loading = false;
      }
    });
  }

 
}
