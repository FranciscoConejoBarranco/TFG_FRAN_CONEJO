import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent { }
