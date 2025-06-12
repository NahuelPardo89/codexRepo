import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportAppAdminPostInterface } from 'src/app/Models/reports/reportAppAdminPost.interface';
import { ReportAppAdminResponseInterface } from 'src/app/Models/reports/reportAppAdminResponse.interface';
import { environment } from 'src/enviroments/environment';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private appointmentReportBaseUrl =
    environment.api_Url + 'report/copayment/appointment/';
  // not implemented yet
  private seminarReportBaseUrl =
    environment.api_Url + 'report/copayment/seminar/';
  constructor(private http: HttpClient) {}

  /**
   * sends a POST request to the server with a body containing
   * appointment filters.
   * @param {ReportAppAdminPostInterface} body This parameter contains the data needed to generate the appointment report.
   * @returns An Observable of type ReportAppAdminResponseInterface is being returned.
   */
  getAdminAppointmentReport(
    body: ReportAppAdminPostInterface
  ): Observable<ReportAppAdminResponseInterface> {
    return this.http.post<ReportAppAdminResponseInterface>(
      this.appointmentReportBaseUrl + 'admin/',
      body
    );
  }
}
