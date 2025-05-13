export interface LibroDetalles {
  id: number;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  description?: string;
  coverImage: string;
  releaseDate?: string;
  pages?: number;
}

