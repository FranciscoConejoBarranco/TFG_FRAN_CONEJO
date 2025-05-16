import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  resenas = [
    {
      tituloLibro: '1984',
      puntuacion: 5,
      comentario: 'Una obra maestra que te hace reflexionar sobre la libertad.',
      fecha: '12/05/2025'
    },
    {
      tituloLibro: 'Dune',
      puntuacion: 4,
      comentario: 'Intrigante, profundo y con un mundo muy bien construido.',
      fecha: '10/05/2025'
    },
    {
      tituloLibro: 'El nombre del viento',
      puntuacion: 5,
      comentario: 'Narrativa preciosa y un personaje inolvidable.',
      fecha: '08/05/2025'
    }
  ];
}
