import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { JwtResponse } from 'src/app/Models/user/jwtResponse.interface';
import { LoginUser } from 'src/app/Models/user/loginUser.interface';
import { RegisterUser } from 'src/app/Models/user/registerUser.interface';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserShort } from 'src/app/Models/user/userShort.interface';
import { jwtDecode } from 'jwt-decode';

import { Router } from '@angular/router';
import { DialogService } from '../dialog/dialog.service';
import { StoreService } from '../store/store.service';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = environment.api_Url + 'account/login/';

  private registerUrl = environment.api_Url + 'account/singin/';
  private logoutUrl = environment.api_Url + 'account/logout/';
  private refreshTokenUrl = environment.api_Url + 'account/refresh/';
  private resetPasswordUrl =
    environment.api_Url + 'account/request-password-reset/';
  private currentUserSubject: BehaviorSubject<UserShort | null> =
    new BehaviorSubject<UserShort | null>(null);
  public readonly currentUser = this.currentUserSubject.asObservable();
  private currentRole = new BehaviorSubject<string>('');
  public readonly currentRoleSubject = this.currentRole.asObservable(); // Inicializa con un rol predeterminado o vacío
  private isloggedIn = new BehaviorSubject<boolean>(false); // Inicializa

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService,
    private storeService: StoreService
  ) {
    if (this.checkToken()) {
      const user = this.storeService.getUser() || '';
      const role = this.storeService.getCurrentRole();
      this.currentRole.next(role);
      this.currentUserSubject.next(JSON.parse(user));
      this.isloggedIn.next(true);
    } else {
      this.logout();
    }
  }
  login(user: LoginUser): void {
    this.http
      .post<JwtResponse>(this.loginUrl, user)
      .pipe(
        tap((response) => {
          this.handleLogin(response);
        }),
        catchError((error) => {
          this.dialogService.showErrorDialog(
            'Usuario o Contraseña incorrectos'
          );
          this.handleError(error, 'Error al iniciar sesión');
          return throwError(() => new Error('Error al iniciar sesión'));
        })
      )
      .subscribe();
  }

  register1(user: RegisterUser): Observable<HttpResponse<JwtResponse>> {
    return this.http
      .post<JwtResponse>(this.registerUrl, user, { observe: 'response' })
      .pipe(
        tap((response) => {
          if (response.status === 201) {
            console.log(response.body);
            this.handleLogin(response.body!);
          }
        }),
        catchError((error) => this.handleError(error, 'Error al registrarse'))
      );
  }
  register(user: RegisterUser): Observable<HttpResponse<JwtResponse>> {
    return this.http.post<JwtResponse>(this.registerUrl, user, {
      observe: 'response',
    });
  }

  logout(): Observable<void> {
    const refreshToken = this.storeService.getRefreshToken();
    this.handleLogout();
    return this.http.post<void>(this.logoutUrl, { refresh: refreshToken }).pipe(
      tap(() => this.handleLogout()),
      catchError((error) => {
        // Incluso si hay un error, limpiamos el cliente
        this.handleLogout();
        // Puedes decidir si quieres manejar este error de alguna manera específica
        return throwError(() => new Error('Token de refresco ha expirado'));
      })
    );
  }

  refreshToken(): Observable<HttpResponse<JwtResponse>> {
    const refreshToken = this.storeService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token no disponible'));
    }

    return this.http
      .post<JwtResponse>(
        this.refreshTokenUrl,
        { refresh: refreshToken },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status === 200 && response.body) {
            this.storeService.setTokens(response.body);
          } else {
            this.logout();
          }
        }),
        catchError((error) => {
          // Incluso si hay un error, limpiamos el cliente
          this.logout();
          // Puedes decidir si quieres manejar este error de alguna manera específica
          return throwError(() => new Error('Refresh token ha expirado'));
        })
      );
  }
  get isLogged(): Observable<boolean> {
    return this.isloggedIn.asObservable();
  }

  private handleError(
    error: HttpErrorResponse,
    defaultMessage: string
  ): Observable<never> {
    // Proporciona un manejo de errores más específico según cada método
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Error del lado del cliente: ${error.error.message}`
        : `Error del servidor: ${error.message}`;

    return throwError(() => new Error(defaultMessage));
  }

  public handleLogin(response: JwtResponse): void {
    this.storeService.setUser(response);
    this.storeService.setTokens(response);
    this.storeService.setRoles(response.roles);
    this.currentUserSubject.next(response.user);
    this.isloggedIn.next(true);
    this.router.navigate(['/Dashboard/accounts/myaccount']);
  }

  setCurrentRole(role: string): void {
    this.currentRole.next(role);
    this.storeService.setCurrentRole(role); // Guarda el rol actual en localStorage
    //window.location.reload(); // Opcional: recarga la página
  }
  get getCurrentUser(): Observable<UserShort | null> {
    return this.currentUserSubject.asObservable();
  }

  getUserRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }
  getUserRole2(): Observable<string> {
    return this.currentRole.asObservable();
  }

  getCurrentRole(): string {
    return localStorage.getItem('currentRole') || this.getUserRoles()[0]; // Devuelve el primer rol disponible si no hay ninguno seleccionado
  }
  private checkToken(): boolean {
    const token = this.storeService.getRefreshToken();

    if (token) {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      const isExpired = decoded.exp < currentTime;
      return !isExpired;
    } else {
      return false;
    }
  }
  handleLogout(): void {
    this.storeService.clearSesionStorage();
    this.currentUserSubject.next(null);
    this.currentRole.next('Paciente');
    this.isloggedIn.next(false);
    this.router.navigate(['']);
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(this.resetPasswordUrl, { email: email });
  }
}
