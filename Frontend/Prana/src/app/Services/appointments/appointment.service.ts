import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { UserShort } from 'src/app/Models/user/userShort.interface';
import { AppointmentAdminGetInterface } from 'src/app/Models/appointments/appointmentAdmin.interface';
import { AppointmentPatientGetInterface } from 'src/app/Models/appointments/get-interfaces/appointmentPatientGet.interface';
import { AppointmentDoctorGetInterface } from 'src/app/Models/appointments/get-interfaces/appointmentDoctorGet.interface';
import { AppointmentPatientCreateInterface } from 'src/app/Models/appointments/create-interfaces/appointmentPatientCreate.interface';
import { AppointmentAdminCreateInterface } from 'src/app/Models/appointments/create-interfaces/appointmentAdminCreate.interface';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl: string = environment.api_Url + 'appointment/';
  private currentUserSubject: BehaviorSubject<UserShort | null> =
    new BehaviorSubject<UserShort | null>(null);
  public readonly currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  /**
   * Get all appointments with admin JSON format response (all fields).
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface[]>} An observable of the appointments.
   */
  getAdminAllAppointments(): Observable<AppointmentAdminGetInterface[]> {
    return this.http.get<AppointmentAdminGetInterface[]>(
      this.baseUrl + 'admin/'
    );
  }

  /**
   * Get a specific appointments with admin JSON format response (all fields).
   * @param appointment_id The ID of the appointment to recover.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface[]>} An observable of the appointment.
   */
  getAdminOneAppointment(
    appointment_id: number
  ): Observable<AppointmentAdminGetInterface> {
    return this.http.get<AppointmentAdminGetInterface>(
      this.baseUrl + 'admin/' + appointment_id + '/'
    );
  }

  /**
   * Get all appointments of a particular doctor with admin JSON format response (all fields).
   * @param doctor_id The ID of the doctor.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface[]>} An observable of the doctor's appointments.
   */
  getAdminDoctorAppointments(
    doctor_id: number
  ): Observable<AppointmentAdminGetInterface[]> {
    const url = this.baseUrl + 'admin/?doctor_id=' + doctor_id;
    return this.http.get<AppointmentAdminGetInterface[]>(url);
  }

  /**
   * Get today's appointments (all).
   * @param doctor_id The ID of the doctor.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface[]>} An observable of the doctor's appointments.
   */
  getAdminTodayAppointments(
    day: string
  ): Observable<AppointmentAdminGetInterface[]> {
    const url = this.baseUrl + 'admin/?day=' + day;
    return this.http.get<AppointmentAdminGetInterface[]>(url);
  }

  /**
   * Get the doctor's appointments for today.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentDoctorGetInterface[]>} An observable of the doctor's appointments.
   */
  getDoctorAllAppointments(): Observable<AppointmentDoctorGetInterface[]> {
    return this.http.get<AppointmentDoctorGetInterface[]>(
      this.baseUrl + 'doctor/'
    );
  }

  /**
   * Get the doctor's appointments for today.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentDoctorGetInterface[]>} An observable of the doctor's appointments.
   */
  getDoctorsTodayAppointments(
    day: string
  ): Observable<AppointmentDoctorGetInterface[]> {
    const url = this.baseUrl + 'doctor/?day=' + day;
    return this.http.get<AppointmentDoctorGetInterface[]>(url);
  }

  /**
   * Get all the patient's appointments.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentPatientGetInterface[]>} An observable of the patient's appointments.
   */
  getPatientAppointments(): Observable<AppointmentPatientGetInterface[]> {
    return this.http.get<AppointmentPatientGetInterface[]>(
      this.baseUrl + 'patient/'
    );
  }

  /**
   * Get today's patient appointments.
   * @param doctor_id The ID of the doctor.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface[]>} An observable of the doctor's appointments.
   */
  getPatientTodayAppointments(
    day: string
  ): Observable<AppointmentAdminGetInterface[]> {
    const url = this.baseUrl + 'patient/?day=' + day;
    return this.http.get<AppointmentAdminGetInterface[]>(url);
  }

  /**
   * Creates an appointment with admin JSON format response (all fields).
   * @param appointment The appointment to create.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface>} An observable of the created appointment.
   */
  createAdminAppointment(
    appointment: AppointmentAdminCreateInterface
  ): Observable<AppointmentAdminGetInterface> {
    return this.http.post<AppointmentAdminGetInterface>(
      this.baseUrl + 'admin/',
      appointment
    );
  }

  /**
   * Creates a doctor's appointment.
   * @param appointment The appointment to create.
   * @author Alvaro Olguin
   * @returns {Observable<any>} An observable of the created appointment.
   */
  createDoctorAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'doctor/', appointment);
  }

  /**
   * Creates a patient's appointment.
   * @param appointment The appointment to create.
   * @author Alvaro Olguin
   * @returns {Observable<any>} An observable of the created appointment.
   */
  createPatientAppointment(
    appointment: AppointmentPatientCreateInterface
  ): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'patient/', appointment);
  }

  /**
   * Delete an appointment.
   * @param appointment_id The id of the appointment to delete.
   * @author Alvaro Olguin
   * @returns {Observable<any>} An observable of the deleted appointment.
   */
  deleteAdminAppointment(appointment_id: number): Observable<any> {
    const url = this.baseUrl + 'admin/' + appointment_id + '/';
    return this.http.delete<any>(url);
  }

  /**
   * Delete a Doctor appointment.
   * @param appointment_id The id of the appointment to delete.
   * @author Alvaro Olguin
   * @returns {Observable<any>} An observable of the deleted appointment.
   */
  deleteDoctorAppointment(appointment_id: number): Observable<any> {
    const url = this.baseUrl + 'doctor/' + appointment_id + '/';
    return this.http.delete<any>(url);
  }

  /**
   * Delete a patient appointment.
   * @param appointment_id The id of the appointment to delete.
   * @author Alvaro Olguin
   * @returns {Observable<any>} An observable of the deleted appointment.
   */
  deletePatientAppointment(appointment_id: number): Observable<any> {
    const url = this.baseUrl + 'patient/' + appointment_id + '/';
    return this.http.delete<any>(url);
  }

  /**
   * Update an appointment with admin options.
   * @param appointment_id The id of the appointment to update.
   * @author Alvaro Olguin
   * @returns {Observable<AppointmentAdminGetInterface>} An observable of the updated appointment.
   */
  updateAdminAppointment(
    appointment_id: number,
    data: AppointmentAdminCreateInterface
  ): Observable<AppointmentAdminGetInterface> {
    const url = this.baseUrl + 'admin/' + appointment_id + '/';
    return this.http.put<AppointmentAdminGetInterface>(url, data);
  }
}
