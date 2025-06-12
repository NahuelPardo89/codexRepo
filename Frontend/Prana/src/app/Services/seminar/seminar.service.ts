import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SeminarAdminDisplayInterface,
  SeminarAdminInterface,
} from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { environment } from 'src/enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class SeminarService {
  private apiUrl = environment.api_Url+'seminar/admin/seminars/';

  constructor(private http: HttpClient) {}

  /**
   * Get all seminars with admin permissions and detailed JSON format response (all fields).
   * @author Alvaro Olguin
   * @returns {Observable<SeminarAdminInterface[]>} An observable of the seminars.
   */
  getSeminarsList(): Observable<SeminarAdminInterface[]> {
    const url = this.apiUrl + '?display=true';
    return this.http.get<SeminarAdminInterface[]>(url);
  }

  /**
   * Get all seminars with admin permissions and detailed JSON format response (all fields).
   * @author Alvaro Olguin
   * @returns {Observable<SeminarAdminInterface[]>} An observable of the seminars.
   */
  getSeminarsListAux(): Observable<SeminarAdminDisplayInterface[]> {
    const url = this.apiUrl + '?display=true';
    return this.http.get<SeminarAdminDisplayInterface[]>(url);
  }

  getSeminars(): Observable<SeminarAdminInterface[]> {
    return this.http.get<SeminarAdminInterface[]>(this.apiUrl);
  }

  getSeminarById(id: number): Observable<SeminarAdminInterface> {
    return this.http.get<SeminarAdminInterface>(`${this.apiUrl}${id}/`);
  }

  createSeminar(
    seminar: SeminarAdminInterface
  ): Observable<SeminarAdminInterface> {
    return this.http.post<SeminarAdminInterface>(this.apiUrl, seminar);
  }

  updateSeminar(
    id: number,
    seminar: SeminarAdminInterface
  ): Observable<SeminarAdminInterface> {
    return this.http.put<SeminarAdminInterface>(
      `${this.apiUrl}${id}/`,
      seminar
    );
  }

  /**
   * Partially updates a seminar with the provided data.
   * @param {number} seminarId - The ID of the seminar to update.
   * @param {Partial<SeminarAdminInterface>} data - The data to update the seminar with.
   * @returns {Observable<SeminarAdminInterface>} An observable of the updated seminar.
   * @author Alvaro Olguin
   */
  partialUpdateSeminar(
    seminarId: number,
    data: Partial<SeminarAdminInterface>
  ): Observable<SeminarAdminInterface> {
    return this.http.patch<SeminarAdminInterface>(
      this.apiUrl + seminarId + '/',
      data
    );
  }

  deleteSeminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
