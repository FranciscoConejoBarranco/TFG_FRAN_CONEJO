import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component'; 

@Component({
  selector: 'app-recomendados',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './recomendados.component.html',
  styleUrls: ['./recomendados.component.css']
})
export class RecomendadosComponent {
  librosRecomendados = [
    {
      title: 'El nombre del viento',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80',
      rating: 4.8
    },
    {
      title: '1984',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
      rating: 4.7
    },
    {
      title: 'Dune',
      image: 'https://images.unsplash.com/photo-1586480183182-4ef0c1dd08b3?auto=format&fit=crop&w=300&q=80',
      rating: 4.9
    }
  ];

  trackByTitulo(index: number, libro: any): string {
    return libro.title;
  }
}
