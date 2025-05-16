import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-gestionusuarios',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './gestionusuarios.component.html',
  styleUrls: ['./gestionusuarios.component.css']
})
export class GestionusuariosComponent {
  usuarios = [
    {
      nombre: 'Ana López',
      email: 'ana@example.com',
      rol: 'Usuario'
    },
    {
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      rol: 'Admin'
    },
    {
      nombre: 'Lucía Márquez',
      email: 'lucia@example.com',
      rol: 'Usuario'
    }
  ];
}
