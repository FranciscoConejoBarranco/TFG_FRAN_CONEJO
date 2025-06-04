import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UsuarioInterface } from '../interfaces/usuario-interface';
import { PaginationResponse } from '../interfaces/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8000/auth/users';

  constructor(private _http: HttpClient) { }

  // Obtener todos los usuarios
  // getUsuarios(): Observable<{ estado: string; data: UsuarioInterface[] }> {
  //   return this._http.get<{ estado: string; data: UsuarioInterface[] }>(this.apiUrl, {
  //     withCredentials: true
  //   }).pipe(
  //     catchError((error) => {
  //       console.error('Error al obtener usuarios:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // Obtener usuario por ID
  getUsuarioPorId(id: number): Observable<{ estado: string; data: UsuarioInterface }> {
    return this._http.get<{ estado: string; data: UsuarioInterface }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario por ID:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar usuario completo
  actualizarUsuario(id: number, usuario: Partial<UsuarioInterface>): Observable<{ estado: string; mensaje: string; data: UsuarioInterface }> {
    return this._http.put<{ estado: string; mensaje: string; data: UsuarioInterface }>(`${this.apiUrl}/${id}`, usuario, {
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error('Error al actualizar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  // Cambiar solo el rol del usuario
  cambiarRolUsuario(id: number, rol: string): Observable<{ estado: string; mensaje: string; data: UsuarioInterface }> {
    return this._http.patch<{ estado: string; mensaje: string; data: UsuarioInterface }>(`${this.apiUrl}/${id}/change-role`, 
      { role: rol }, 
      {
        withCredentials: true
      }
    ).pipe(
      catchError((error) => {
        console.error('Error al cambiar rol:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar usuario
  eliminarUsuario(id: number): Observable<{ estado: string; mensaje: string }> {
    return this._http.delete<{ estado: string; mensaje: string }>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error('Error al eliminar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener estados disponibles
  getEstados(): Observable<{ estado: string; data: any[] }> {
    return this._http.get<{ estado: string; data: any[] }>('http://localhost:8000/auth/estados', {
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener estados:', error);
        return throwError(() => error);
      })
    );
  }

  // Método auxiliar para validar roles
  getRolesDisponibles(): string[] {
    return ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'];
  }

  // Método auxiliar para obtener el nombre del rol sin prefijo
  getNombreRol(rol: string): string {
    const roles: { [key: string]: string } = {
      'ROLE_USER': 'Usuario',
      'ROLE_ADMIN': 'Administrador',
      'ROLE_SUPERADMIN': 'Super Administrador'
    };
    return roles[rol] || rol;
  }

  // Método auxiliar para obtener el color del estado
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      'Verificado': 'green',
      'Pendiente': 'orange',
      'Bloqueado': 'red',
      'Inactivo': 'gray'
    };
    return colores[estado] || 'gray';
  }

  // Obtener usuarios con paginación
  getUsuarios(page: number = 1, limit: number = 10): Observable<PaginationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this._http.get<PaginationResponse>(this.apiUrl, {
      params: params,
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => error);
      })
    );
  }
}
