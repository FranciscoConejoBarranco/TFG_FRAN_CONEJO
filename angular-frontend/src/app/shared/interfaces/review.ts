export interface ReviewInterface {
  id: number;
  contenido: string;
  valoracion: number;
  usuarioId: number;
  fecha: string;
}


export interface ReviewsPorLibroResponse {
  reviews: ReviewInterface[];
  miReview: ReviewInterface | null;
  pagination: any;
}
