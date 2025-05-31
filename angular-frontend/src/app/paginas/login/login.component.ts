import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  modelo = {
    email: '',
    password: ''
  };

  error = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  enviar(): void {
    if (!this.modelo.email || !this.modelo.password) {
      this.error = 'Debes completar todos los campos';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.modelo).subscribe({
      next: () => {
        this.authService.fetchUser().subscribe({
          next: (user) => {
            if (!user) {
              this.error = 'Error al obtener usuario';
              this.isLoading = false;
              return;
            }

            const role = user.role;
            this.redirectUserBasedOnRole(role);
          },
          error: (err) => {
            this.error = 'No se pudo obtener el usuario';
            this.isLoading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas o error del servidor';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private redirectUserBasedOnRole(role: string[]): void {
    const userRole = role[0];

    switch (userRole) {
      case 'ROLE_SUPERADMIN':
        this.router.navigate(['/dashboardadmin']);
        break;
      case 'ROLE_USER':
        this.router.navigate(['/dashboardusuario']);
        break;
      default:
        console.warn('Rol no reconocido:', userRole);
        this.router.navigate(['/']);
        break;
    }
  }
}
