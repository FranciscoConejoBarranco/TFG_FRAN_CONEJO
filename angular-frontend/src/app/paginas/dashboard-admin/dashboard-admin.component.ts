import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDashboardComponent } from '../../modules/navbar-dashboard/navbar-dashboard.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../modules/footer/footer.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NavbarDashboardComponent, RouterModule, FooterComponent] ,
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {}
