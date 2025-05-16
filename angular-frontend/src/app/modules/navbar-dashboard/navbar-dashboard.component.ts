import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar-dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent]
})
export class NavbarDashboardComponent {
  isMenuOpen: boolean = false;
  
  role: string = 'USER'; // o 'SUPERADMIN'

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu toggled:', this.isMenuOpen); // Para depuración
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu();
    }
  }
}