import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleAdminInterface } from 'src/app/Models/schedule/scheduleAdminInterface.interface';
import { environment } from 'src/enviroments/environment';
/**
 * Service for managing seminar schedules in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = environment.api_Url+'seminar/admin/seminar-schedule/';

  /**
   * Initializes the service.
   * @param {HttpClient} http - The HTTP client for making requests.
   * @author Alvaro Olguin Armendariz
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all seminar schedules.
   * @returns {Observable<ScheduleAdminInterface[]>} An observable with the list of seminar schedules.
   * @author Alvaro Olguin Armendariz
   */
  getSchedules(): Observable<ScheduleAdminInterface[]> {
    return this.http.get<ScheduleAdminInterface[]>(this.apiUrl);
  }

  /**
   * Creates a seminar schedule.
   * @param {ScheduleAdminInterface} body - The data of the seminar schedule to create.
   * @returns {Observable<ScheduleAdminInterface>} An observable with the data of the created seminar schedule.
   * @author Alvaro Olguin Armendariz
   */
  createAdminSchedule(
    body: ScheduleAdminInterface
  ): Observable<ScheduleAdminInterface> {
    return this.http.post<ScheduleAdminInterface>(this.apiUrl, body);
  }

  /**
   * Updates a seminar schedule.
   * @param {number} scheduleId - The ID of the seminar schedule to update.
   * @param {ScheduleAdminInterface} body - The new data of the seminar schedule.
   * @returns {Observable<ScheduleAdminInterface>} An observable with the data of the updated seminar schedule.
   * @author Alvaro Olguin Armendariz
   */
  updateAdminSchedule(
    scheduleId: number,
    body: ScheduleAdminInterface
  ): Observable<ScheduleAdminInterface> {
    return this.http.put<ScheduleAdminInterface>(
      this.apiUrl + scheduleId + '/',
      body
    );
  }

  /**
   * Deletes a seminar schedule.
   * @param {number} scheduleId - The ID of the seminar schedule to delete.
   * @returns {Observable<void>} An observable that completes once the seminar schedule has been deleted.
   * @author Alvaro Olguin Armendariz
   */
  deleteSchedule(scheduleId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + scheduleId + '/');
  }
}
