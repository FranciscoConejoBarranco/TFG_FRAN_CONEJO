import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-gestionlibros',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './gestionlibros.component.html',
  styleUrls: ['./gestionlibros.component.css']
})
export class GestionlibrosComponent {
  libros = [
    { title: 'El nombre del viento', autor: 'Patrick Rothfuss', stock: 12 },
    { title: '1984', autor: 'George Orwell', stock: 7 },
    { title: 'Dune', autor: 'Frank Herbert', stock: 5 }
  ];
}
