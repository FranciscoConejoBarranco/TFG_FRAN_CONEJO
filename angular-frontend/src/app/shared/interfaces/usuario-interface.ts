export interface UsuarioInterface {
  id: number;
  name: string;
  email: string;
  roles: string[];
  estado: string;
}

// Interface para crear/actualizar usuario
export interface UsuarioUpdateInterface {
  name?: string;
  email?: string;
  roles?: string[];
  estado?: string;
}

// Interface para respuestas del servidor
export interface UsuarioResponse {
  estado: string;
  mensaje?: string;
  data: UsuarioInterface | UsuarioInterface[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginationResponse {
  estado: string;
  data: UsuarioInterface[];
  pagination: PaginationInfo;
}