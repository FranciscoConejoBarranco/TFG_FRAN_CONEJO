import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../interfaces/usuario-interface';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8000/auth/users'; // Ajusta si cambias el puerto o path base

  constructor(private _http: HttpClient) { }

  getUsuarios(): Observable<{ data: UsuarioInterface[] }> {
    return this._http.get<{ data: UsuarioInterface[] }>(this.apiUrl);
  }
}
