import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { User } from 'src/app/Models/user/user.interface';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.api_Url+'account/admin/';
  private meUrl =environment.api_Url+'account/me/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<User> {
    const url = `${this.apiUrl}${userId}/`;
    return this.http.get<User>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );

  }

  createUser(user: User): Observable<void> {
   
    return this.http.post<void>(this.apiUrl, user)
  }


  updateUser(userId: number, userData: User): Observable<void> {
    const url = `${this.apiUrl}${userId}/`;
    return this.http.put<void>(url, userData);
  }

  deleteUser(userId: number): Observable<void> {
    const url = `${this.apiUrl}${userId}/`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }
  getLoggedUser(): Observable<User> {
    return this.http.get<User>(this.meUrl);
  }

  updateLoggedUser(userData: User): Observable<void> {
    const url = this.meUrl; // Solo el endpoint a LoggedUserViewSet
    return this.http.put<void>(url, userData).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const url = `${this.meUrl}set_password/`; // URL del endpoint
    return this.http.post(url, { old_password: oldPassword, new_password: newPassword });
  }
}
