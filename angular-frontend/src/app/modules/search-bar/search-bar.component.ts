import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../shared/interfaces/book';
import { Category } from '../../shared/interfaces/category';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input() searchQuery: string = '';
  @Input() categories: Category[] = [];
  @Input() books: Book[] = [];
  
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<Category>();

  updateSearch(event: any) {
    const value = event.target.value;
    this.searchQueryChange.emit(value);
    this.search.emit(value);
  }

  selectCategory(category: Category) {
    this.categorySelected.emit(category);
  }
}