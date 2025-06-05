import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LibroInterface } from '../interfaces/libro-interface';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private baseUrl = 'http://localhost:8000/libros';

  constructor(private http: HttpClient) {}

  buscarLibro(titulo: string): Observable<LibroInterface> {
    const params = new HttpParams().set('titulo', titulo);

    return this.http.get<LibroInterface>(`${this.baseUrl}/buscar`, { params }).pipe(
      catchError((error) => {
        console.error('Error al buscar libro:', error);
        return throwError(() => error);
      })
    );
  }

  libroPorId(id: number): Observable<LibroInterface> {
    return this.http.get<LibroInterface>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener libro por ID:', error);
        return throwError(() => error);
      })
    );
  }

  
  listarLibros(): Observable<LibroInterface[]> {
    return this.http.get<LibroInterface[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('Error al listar libros:', error);
        return throwError(() => error);
      })
    );
  }

 
  eliminarLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al eliminar libro con ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }


  
}
