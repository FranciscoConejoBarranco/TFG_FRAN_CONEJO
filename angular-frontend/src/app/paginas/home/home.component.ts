import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../modules/navbar/navbar.component';
import { SearchBarComponent } from '../../modules/search-bar/search-bar.component';
import { FooterComponent } from '../../modules/footer/footer.component';
import { Book } from '../../shared/interfaces/book';
import { Category } from '../../shared/interfaces/category';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, SearchBarComponent, FooterComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchQuery = '';
  books: Book[] = [];
  selectedCategory: Category | null = null;
  Math = Math; // Expose Math to the template for rounding ratings
  
  categories: Category[] = [
    {
      name: "Acción",
      books: [
        {
          id: 1,
          title: "El Código Da Vinci",
          rating: 4.5,
          image: "https://images.pexels.com/photos/15419259/pexels-photo-15419259.jpeg",
        },
        {
          id: 2,
          title: "Misión Imposible",
          rating: 4.8,
          image: "https://images.pexels.com/photos/7768663/pexels-photo-7768663.jpeg",
        },
        {
          id: 3,
          title: "Bourne Identity",
          rating: 4.3,
          image: "https://images.pexels.com/photos/7768663/pexels-photo-7768663.jpeg",
        },
        {
          id: 4,
          title: "Jack Reacher",
          rating: 4.6,
          image: "https://images.pexels.com/photos/1932584/pexels-photo-1932584.jpeg",
        },
        {
          id: 5,
          title: "Sin Límites",
          rating: 4.2,
          image: "https://images.pexels.com/photos/7768663/pexels-photo-7768663.jpeg",
        },
      ],
    },
    {
      name: "Romance",
      books: [
        {
          id: 1,
          title: "Orgullo y Prejuicio",
          rating: 4.9,
          image: "https://images.pexels.com/photos/29684718/pexels-photo-29684718.jpeg",
        },
        {
          id: 2,
          title: "Bajo la Misma Estrella",
          rating: 4.7,
          image: "https://images.pexels.com/photos/5245973/pexels-photo-5245973.jpeg",
        },
        {
          id: 3,
          title: "Yo Antes de Ti",
          rating: 4.5,
          image: "https://images.pexels.com/photos/8532639/pexels-photo-8532639.jpeg",
        },
        {
          id: 4,
          title: "El Cuaderno de Noah",
          rating: 4.6,
          image: "https://images.pexels.com/photos/15382595/pexels-photo-15382595.jpeg",
        },
        {
          id: 5,
          title: "Bridgerton",
          rating: 4.4,
          image: "https://images.pexels.com/photos/15653088/pexels-photo-15653088.jpeg",
        },
      ],
    },
    {
      name: "Fantasía",
      books: [
        {
          id: 1,
          title: "Harry Potter",
          rating: 4.9,
          image: "https://images.pexels.com/photos/6806609/pexels-photo-6806609.jpeg",
        },
        {
          id: 2,
          title: "El Señor de los Anillos",
          rating: 4.8,
          image: "https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg",
        },
        {
          id: 3,
          title: "Juego de Tronos",
          rating: 4.7,
          image: "https://images.pexels.com/photos/4235845/pexels-photo-4235845.jpeg",
        },
        {
          id: 4,
          title: "Las Crónicas de Narnia",
          rating: 4.6,
          image: "https://images.pexels.com/photos/1314584/pexels-photo-1314584.jpeg",
        },
        {
          id: 5,
          title: "El Nombre del Viento",
          rating: 4.5,
          image: "https://images.pexels.com/photos/5530778/pexels-photo-5530778.jpeg",
        },
      ],
    },
    {
      name: "Misterio",
      books: [
        {
          id: 1,
          title: "Sherlock Holmes",
          rating: 4.8,
          image: "https://images.pexels.com/photos/1769067/pexels-photo-1769067.jpeg",
        },
        {
          id: 2,
          title: "La Chica del Tren",
          rating: 4.4,
          image: "https://images.pexels.com/photos/17601658/pexels-photo-17601658.jpeg",
        },
        {
          id: 3,
          title: "El Silencio de los Corderos",
          rating: 4.7,
          image: "https://images.pexels.com/photos/1769067/pexels-photo-1769067.jpeg",
        },
        {
          id: 4,
          title: "Gone Girl",
          rating: 4.5,
          image: "https://images.pexels.com/photos/1643033/pexels-photo-1643033.jpeg",
        },
        {
          id: 5,
          title: "El Psicoanalista",
          rating: 4.6,
          image: "https://images.pexels.com/photos/4421262/pexels-photo-4421262.jpeg",
        },
      ],
    },
  ];

  constructor() {
    // Initialize books array with all books from all categories
    this.categories.forEach(category => {
      this.books = [...this.books, ...category.books];
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    // Implement search logic here
    console.log('Searching for:', query);
  }

  onCategorySelected(category: Category) {
    this.selectedCategory = category;
    console.log('Category selected:', category.name);
  }

  updateSearch(query: string) {
    this.searchQuery = query;
  }

  trackByCategory(index: number, category: Category): string {
    return category.name;
  }

  trackByBook(index: number, book: Book): number {
    return book.id;
  }
}