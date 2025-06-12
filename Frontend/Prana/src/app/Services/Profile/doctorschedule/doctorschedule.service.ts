import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorScheduleInterface } from 'src/app/Models/Profile/doctorschedule.interface';
import { DoctorAvailableTimes } from 'src/app/Models/appointments/doctor-availables-times/appointmentAdmin.interface';
import { environment } from 'src/enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class DoctorscheduleService {
  private baseUrl: string =
    environment.api_Url + 'profile/admin/doctor-schedules/';

  constructor(private http: HttpClient) {}

  /**
   * Get the schedules for all doctors.
   * @author Alvaro Olguin
   * @returns {Observable<DoctorScheduleInterface[]>} An observable of the doctors' schedules.
   */
  getAllDoctorsSchedules(): Observable<DoctorScheduleInterface[]> {
    return this.http.get<DoctorScheduleInterface[]>(this.baseUrl);
  }

  /**
   * Get the schedule for a particular doctor.
   * @param doctor_id The ID of the doctor.
   * @author Alvaro Olguin
   * @returns {Observable<DoctorScheduleInterface[]>} An observable of the doctor's schedule.
   */
  getDoctorSchedule(doctor_id: number): Observable<DoctorScheduleInterface[]> {
    const url = this.baseUrl + '?doctor_id=' + doctor_id;
    return this.http.get<DoctorScheduleInterface[]>(url);
  }

  /**
   * Get the available times for a particular doctor on a particular day.
   * @param doctor_id The ID of the doctor.
   * @param day The day to fetch the available times for.
   * @author Alvaro Olguin
   * @returns {Observable<DoctorAvailableTimes>} An observable of the doctor's available times.
   */
  getDoctorAvailableTime(
    doctor_id: number,
    day: string | null
  ): Observable<DoctorAvailableTimes> {
    const url =
      environment.api_Url +
      `profile/admin/doctor-available-times/${doctor_id}/${day}/`;
    return this.http.get<DoctorAvailableTimes>(url);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  createSchedule(
    data: DoctorScheduleInterface
  ): Observable<DoctorScheduleInterface> {
    return this.http.post<DoctorScheduleInterface>(this.baseUrl, data);
  }

  updateSchedule(
    id: number,
    data: DoctorScheduleInterface
  ): Observable<DoctorScheduleInterface> {
    return this.http.patch<DoctorScheduleInterface>(
      `${this.baseUrl}${id}/`,
      data
    );
  }
}
