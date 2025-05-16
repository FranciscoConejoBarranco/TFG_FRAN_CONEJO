import { Routes } from '@angular/router';
import { TasksComponent } from './modules/tasks/tasks.component';
import { LandingComponent } from './modules/landing/landing.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { HomeComponent } from './paginas/home/home.component';
import { DetallesLibroComponent } from './paginas/detalles-libro/detalles-libro.component';
import {  DashboardUsuarioComponent } from './paginas/dashboard-usuario/dashboard-usuario.component';
import { DashboardAdminComponent } from './paginas/dashboard-admin/dashboard-admin.component';
import { MislistasComponent } from './paginas/mislistas/mislistas.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { ReviewsComponent } from './paginas/reviews/reviews.component';
import { RecomendadosComponent } from './paginas/recomendados/recomendados.component';
import { GestionlibrosComponent } from './paginas/gestionlibros/gestionlibros.component';
import { GestionreviewsComponent } from './paginas/gestionreviews/gestionreviews.component';
import { GestionusuariosComponent } from './paginas/gestionusuarios/gestionusuarios.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "tasks", component: TasksComponent},
    {path: "registro", component: RegistroComponent},
    {path: "login", component: LoginComponent},
    {path: "detalles", component: DetallesLibroComponent},
    {path: "home", component: HomeComponent},
    {path: "dashboardusuario", component: DashboardUsuarioComponent},
    {path: "dashboardadmin", component: DashboardAdminComponent},
    {path: "mislistas", component: MislistasComponent},
    {path: "perfil", component: PerfilComponent},
    {path: "reviews", component: ReviewsComponent},
    {path: "recomendados", component: RecomendadosComponent},
    {path: "gestionlibros", component: GestionlibrosComponent},
    {path: "gestionreviews", component: GestionreviewsComponent},
    {path: "gestionusuarios", component: GestionusuariosComponent},
];
