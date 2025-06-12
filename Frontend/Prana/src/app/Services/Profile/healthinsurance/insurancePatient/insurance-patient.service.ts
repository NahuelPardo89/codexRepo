import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsurancePlanPatient } from 'src/app/Models/Profile/isurancePlanPatient.interface';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsurancePatientService {
  private url = environment.api_Url + 'profile/admin/insurance-plans-patient/';
  constructor(private http: HttpClient) {}

  getAll(): Observable<InsurancePlanPatient[]> {
    return this.http.get<InsurancePlanPatient[]>(`${this.url}`);
  }

  getAllofPatient(patientId?: number): Observable<InsurancePlanPatient[]> {
    let apiUrl = this.url;
    if (patientId) {
      apiUrl += `?patientId=${patientId}`;
    }
    return this.http.get<InsurancePlanPatient[]>(apiUrl);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }

  // Crear una nueva HealthInsurance
  create(data: InsurancePlanPatient): Observable<any> {
    return this.http.post(`${this.url}`, data);
  }

  update(id: number, data: InsurancePlanPatient): Observable<any> {
    return this.http.put(`${this.url}${id}/`, data);
  }
}
