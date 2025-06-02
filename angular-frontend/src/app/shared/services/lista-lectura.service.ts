import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ListaLecturaInterface } from '../interfaces/lista-lectura.interface';

@Injectable({
  providedIn: 'root'
})
export class ListaLecturaService {

  private apiUrl = `${environment.api}api/lista-lectura`;

  constructor(private _http: HttpClient) {}

  /**
   * Crea una lista de lectura.
   */
  crearLista(nombre: string): Observable<ListaLecturaInterface> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('Todas las cookies:', document.cookie);
    return this._http.post<ListaLecturaInterface>(
      `${this.apiUrl}/crear`,
      { nombre },
      { headers: headers, withCredentials: true }
    );
    
  }

  /**
   * Obtiene todas las listas de lectura.
   */
  obtenerListas(): Observable<ListaLecturaInterface[]> {
    return this._http.get<ListaLecturaInterface[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  /**
   * Obtiene el detalle de una lista por ID.
   */
  obtenerDetalle(id: number): Observable<ListaLecturaInterface> {
    return this._http.get<ListaLecturaInterface>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  /**
   * Actualiza el nombre de una lista.
   */
  actualizarLista(id: number, nombre: string): Observable<ListaLecturaInterface> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.put<ListaLecturaInterface>(
      `${this.apiUrl}/${id}`,
      { nombre },
      { headers: headers, withCredentials: true }
    );
  }

  /**
   * Elimina una lista por ID.
   */
  eliminarLista(id: number): Observable<{ message: string }> {
    return this._http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  /**
   * Agrega un libro a una lista.
   */
  agregarLibroALista(libroId: number, listaId: number): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<{ message: string }>(
      `${this.apiUrl}/${listaId}/agregar-libro`,
      { libroId },
      { headers: headers, withCredentials: true }
    );
  }
}
