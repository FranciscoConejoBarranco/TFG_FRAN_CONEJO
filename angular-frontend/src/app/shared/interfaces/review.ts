export interface ReviewInterface {
  id: number;
  contenido: string;
  valoracion: number;
  usuarioId: number;
  fecha: string;
  libro: {
    id: number;
    titulo: string;
    autor: string;
    imagen?: string;
  };
}

export interface ReviewsPorLibroResponse {
  reviews: ReviewInterface[];
  miReview: ReviewInterface | null;
  pagination: any;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ReviewsResponse {
  reviews: ReviewInterface[];
  pagination: PaginationInfo;
}

