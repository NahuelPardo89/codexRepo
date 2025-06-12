import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patient, PatientView } from 'src/app/Models/Profile/patient.interface';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = environment.api_Url + 'profile/admin/patient/';
  private currentPatientUrl = environment.api_Url + 'profile/patient/';

  constructor(private httpClient: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.httpClient.get<Patient[]>(this.apiUrl);
  }

  /**
   * Retrieves a view of all patients.
   *
   * @returns {Observable<PatientView[]>} An Observable that emits a list of patient views.
   */
  getAllPatientsView(): Observable<PatientView[]> {
    return this.httpClient.get<PatientView[]>(this.apiUrl);
  }

  /**
   * This function retrieves the current (logged) patient information.
   * @author Alvaro Olguin
   * @returns {Observable<Patient>} An Observable that contains the patient profile.
   */
  getCurrentPatient(): Observable<Patient> {
    return this.httpClient.get<Patient>(this.currentPatientUrl);
  }

  // Función para calcular el campo fullName a partir del campo user
  private calculateFullName(userId: number): string {
    // Lógica para calcular el nombre y apellido a partir del userId
    // Puedes implementar esta lógica según cómo estén estructurados los IDs
    // y los datos en tu aplicación.
    // Ejemplo:
    const firstName = 'John'; // Reemplaza con la lógica real
    const lastName = 'Doe'; // Reemplaza con la lógica real
    return `${firstName} ${lastName}`;
  }

  getPatientById(id: number): Observable<Patient> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.get<Patient>(url);
  }

  updatePatient(id: number, patientData: Patient): Observable<Patient> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.put<Patient>(url, patientData);
  }

  deletePatient(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete<any>(url);
  }

  getPatientDetailsById(id: number): Observable<Patient> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.get<Patient>(url);
  }

  updateLoggedPatient(patient: Patient): Observable<void> {
    const url = this.currentPatientUrl;
    return this.httpClient.put<void>(url, patient).pipe(
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }
}
