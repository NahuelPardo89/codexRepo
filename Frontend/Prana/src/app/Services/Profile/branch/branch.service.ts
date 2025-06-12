import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { environment } from 'src/enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private baseUrl: string =
    environment.api_Url + 'profile/admin/speciality-branch/';
  private meUrl: string =
    environment.api_Url + 'profile/admin/me-speciality-branch/';
  private baseUrl2: string = environment.api_Url + 'profile/admin/';

  constructor(private http: HttpClient) {}

  // Get all speciality branches
  getSpecialityBranches(): Observable<SpecialityBranch[]> {
    return this.http.get<SpecialityBranch[]>(this.baseUrl);
  }

  // Get a specific speciality branch by ID
  getSpecialityBranch(id: number): Observable<SpecialityBranch> {
    return this.http.get<SpecialityBranch>(`${this.baseUrl}${id}/`);
  }

  getDoctorBranches(doctor_id: number): Observable<SpecialityBranch[]> {
    const url = environment.api_Url + 'profile/admin/doctor-branches/';
    return this.http.get<SpecialityBranch[]>(url + '?doctor_id=' + doctor_id);
  }
  getDoctorBranchesBySpeciality(
    doctorId: number
  ): Observable<SpecialityBranch[]> {
    return this.http.get<SpecialityBranch[]>(
      this.baseUrl2 + `doctor-branches-by-speciality/?doctor_id=${doctorId}`
    );
  }
  // Create a new speciality branch
  createSpecialityBranch(data: SpecialityBranch): Observable<SpecialityBranch> {
    return this.http.post<SpecialityBranch>(this.baseUrl, data);
  }

  // Update an existing speciality branch
  updateSpecialityBranch(
    id: number,
    data: SpecialityBranch
  ): Observable<SpecialityBranch> {
    return this.http.put<SpecialityBranch>(`${this.baseUrl}${id}/`, data);
  }

  // Delete a speciality branch
  deleteSpecialityBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  getMeSpecialityBranches(): Observable<SpecialityBranch[]> {
    return this.http.get<SpecialityBranch[]>(this.meUrl);
  }
}
