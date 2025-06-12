import { Injectable } from '@angular/core';
import { JwtResponse } from 'src/app/Models/user/jwtResponse.interface';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  setUser(response: JwtResponse){
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  setTokens(response: JwtResponse){
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
  }

  setCurrentRole(role: string){
    localStorage.setItem('currentRole', role);
  }

  setRoles(roles: string[]){
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getUser(){
    return localStorage.getItem('user');
  }
  getUserRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  getCurrentRole(): string {
    return localStorage.getItem('currentRole') || this.getUserRoles()[0]; // Devuelve el primer rol disponible si no hay ninguno seleccionado
  }
  getAccessToken(): string {
    return localStorage.getItem('access_token')||'';
  }
  getRefreshToken(): string {
    return localStorage.getItem('refresh_token')||'';
  }
  clearSesionStorage(): void {
    
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    localStorage.removeItem('currentRole');
  }
}
