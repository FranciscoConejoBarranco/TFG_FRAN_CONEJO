export interface LibroEnListaInterface {
  libroId: number;
  titulo: string;
  estadoLectura: string;
}

export interface ListaLecturaInterface {
  id: number;
  nombre: string;
  fechaCreacion: string;
  usuario: number;
  libros: LibroEnListaInterface[];
}
