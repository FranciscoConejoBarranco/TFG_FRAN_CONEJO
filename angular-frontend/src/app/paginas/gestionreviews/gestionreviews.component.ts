import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-gestionreviews',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './gestionreviews.component.html',
  styleUrls: ['./gestionreviews.component.css']
})
export class GestionreviewsComponent {
  reviews = [
    {
      usuario: 'Ana López',
      libro: 'Dune',
      comentario: 'Una obra maestra de la ciencia ficción.',
      puntuacion: 5
    },
    {
      usuario: 'Carlos Ruiz',
      libro: '1984',
      comentario: 'Impactante y muy actual.',
      puntuacion: 4.5
    }
  ];
}
