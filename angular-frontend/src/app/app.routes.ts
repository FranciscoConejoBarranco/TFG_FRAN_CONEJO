import { Routes } from '@angular/router';
import { TasksComponent } from './modules/tasks/tasks.component';
import { LandingComponent } from './modules/landing/landing.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { PanelComponent } from './paginas/panel/panel.component';
import { HomeComponent } from './paginas/home/home.component';
import { DetallesLibroComponent } from './paginas/detalles-libro/detalles-libro.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "tasks", component: TasksComponent},
    {path: "registro", component: RegistroComponent},
    {path: "login", component: LoginComponent},
    {path: "panel", component: PanelComponent},
    {path: "detalles", component: DetallesLibroComponent},
    {path: "home", component: HomeComponent}
    
];
