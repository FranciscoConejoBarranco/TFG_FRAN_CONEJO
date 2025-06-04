import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { ReviewInterface } from '../interfaces/review.interface';
// import { ReviewsPorLibroResponse } from '../interfaces/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.api}api/review`;

  constructor(private _http: HttpClient) {}

  /**
   * Crea una review para un libro.
   */
  crearReview(
    contenido: string,
    libroId: number,
    valoracion: number
  ): Observable<{ message: string; reviewId: number }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = {
      contenido: contenido.trim(),
      libroId: parseInt(libroId.toString(), 10),
      rating: parseInt(valoracion.toString(), 10), // Asegurar que sea entero
    };

    console.log('Payload enviado:', payload); // Para debug

    return this._http.post<{ message: string; reviewId: number }>(
      `${this.apiUrl}/crear`,
      payload,
      { headers: headers, withCredentials: true }
    );
  }

  /**
   * Edita una review existente.
   */
  editarReview(
    reviewId: number,
    contenido: string,
    libroId: number,
    valoracion: number
  ): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = {
      contenido: contenido,
      libroId: libroId,
      rating: valoracion,
    };
    return this._http.put<{ message: string }>(
      `${this.apiUrl}/${reviewId}`,
      payload,
      { headers: headers, withCredentials: true }
    );
  }

  /**
   * Elimina una review por ID.
   */
  eliminarReview(reviewId: number): Observable<{ message: string }> {
    return this._http.delete<{ message: string }>(
      `${this.apiUrl}/${reviewId}`,
      { withCredentials: true }
    );
  }

  /**
   * Obtiene reviews de un libro con paginación.
   */
  obtenerReviewsPorLibro(
    libroId: number,
    page: number = 1,
    limit: number = 10
  ): Observable<{ reviews: ReviewInterface[]; miReview: ReviewInterface | null; pagination: any }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    return this._http.get<{ reviews: ReviewInterface[]; miReview: ReviewInterface | null; pagination: any }>(
      `${environment.api}api/libro/${libroId}/reviews`,
      {
        params,
        withCredentials: true,
      }
    );
  }
  

  /**
   * Método legacy para compatibilidad (carga solo la primera página)
   */
  obtenerReviewsPorLibroSimple(libroId: number): Observable<ReviewInterface[]> {
    return this.obtenerReviewsPorLibro(libroId, 1, 10).pipe(
      map((response) => response.reviews)
    );
  }
}
