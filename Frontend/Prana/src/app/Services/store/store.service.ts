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
    document.cookie = `access_token=${response.access}; path=/; secure`;
    document.cookie = `refresh_token=${response.refresh}; path=/; secure;`;
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
  private getCookie(name: string): string {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }
  getAccessToken(): string {
    return this.getCookie('access_token');
  }
  getRefreshToken(): string {
    return this.getCookie('refresh_token');
  }
  clearSesionStorage(): void {
    
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    localStorage.removeItem('currentRole');
  }
}
