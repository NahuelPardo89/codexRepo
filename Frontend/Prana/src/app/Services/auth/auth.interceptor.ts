import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { environment } from 'src/enviroments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthenticationToken(req)).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          req.url !== environment.api_Url + 'account/refresh/'
        ) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return request;
    }
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          if (response.status === 200 && response.body) {
            // La actualización del localStorage y el manejo de los tokens se hacen en refreshToken2

            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.body.access);
            return next.handle(this.addAuthenticationToken(request));
          } else {
            return throwError(() => new Error('No se pudo refrescar el token'));
          }
        }),
        catchError((refreshError) => {
          // En caso de error en la petición de refresco, maneja el error aquí
          alert('Su sesion ha expirado');
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          return throwError(() => refreshError);
        })
      );
    } else {
      // Si ya se está refrescando el token, espera a que se complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addAuthenticationToken(request));
        })
      );
    }
  }
}
