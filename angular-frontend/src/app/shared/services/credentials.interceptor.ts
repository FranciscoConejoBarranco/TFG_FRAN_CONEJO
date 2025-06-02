import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    let apiReq = req.clone({
      withCredentials: true
    });

    // Si es una petición a la API (no auth), añadir token en cabecera
    if (req.url.includes('/api/')) {
      const token = this.getToken();
      if (token) {
        apiReq = apiReq.clone({
          setHeaders: {
            'X-AUTH-TOKEN': token
          },
          withCredentials: true
        });
      }
    }

    return next.handle(apiReq);
  }

  private getToken(): string | null {
    // Usar 'X-AUTH-TOKEN' que es el nombre correcto
    return this.getCookie('X-AUTH-TOKEN') || 
           this.getCookie('codearts_token') || 
           this.getCookie('jwt_token') || 
           this.getCookie('auth_token');
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
}