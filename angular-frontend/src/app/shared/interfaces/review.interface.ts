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
    }; // formato 'Y-m-d H:i'
  }
  