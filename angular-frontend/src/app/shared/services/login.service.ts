import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginInterface } from '../interfaces/login-interface';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http:HttpClient) { }
  
    sendData(modelo: LoginInterface):Observable<any>
    {
      return this._http.post(`${environment.api}auth/login`, modelo, {'headers':
         {'content-type': 'application/json'}});
    }
}
