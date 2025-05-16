import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../shared/interfaces/book';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-dashboard-usuario',
  templateUrl: './dashboard-usuario.component.html',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  styles: [`
    .scrollable-container::-webkit-scrollbar {
      height: 8px;
    }
    .scrollable-container::-webkit-scrollbar-track {
      background: #333;
    }
    .scrollable-container::-webkit-scrollbar-thumb {
      background: #666;
      border-radius: 4px;
    }
    .book-card:hover {
      transform: scale(1.02);
    }
  `]
})
export class DashboardUsuarioComponent {
  books: Book[] = [
    {
      id: 7,
      title: "Snow Crash",
      rating: 4.5,
      image: "https://images.pexels.com/photos/32026686/pexels-photo-32026686.jpeg"
    },
    {
      id: 7,
      title: "Snow Crash",
      rating: 4.5,
      image: "https://images.pexels.com/photos/32026686/pexels-photo-32026686.jpeg"
    },
    {
      id: 7,
      title: "Snow Crash",
      rating: 4.5,
      image: "https://images.pexels.com/photos/32026686/pexels-photo-32026686.jpeg"
    },
  ];

  trackByBook(index: number, book: Book): number {
    return book.id;
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  Math = Math;
}
