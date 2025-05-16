import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mislistas',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent, RouterModule],
  templateUrl: './mislistas.component.html',
  styleUrls: ['./mislistas.component.css']
})
export class MislistasComponent {
  listas = [
    {
      nombre: 'Favoritos de Ciencia Ficción',
      descripcion: 'Mis novelas favoritas del espacio y futuros distópicos.',
      cantidad: 12
    },
    {
      nombre: 'Pendientes de Leer',
      descripcion: 'Libros que me han recomendado y quiero empezar pronto.',
      cantidad: 7
    },
    {
      nombre: 'Clásicos imprescindibles',
      descripcion: 'Lecturas obligadas que todo lector debería conocer.',
      cantidad: 5
    }
  ];
}
