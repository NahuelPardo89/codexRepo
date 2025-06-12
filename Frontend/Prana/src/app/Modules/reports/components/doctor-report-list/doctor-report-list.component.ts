import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentAdminGetInterface } from 'src/app/Models/appointments/appointmentAdmin.interface';
import {
  ReportAppAdminResponseInterface,
  ReportAppAdminSummaryResponseInterface,
} from 'src/app/Models/reports/reportAppAdminResponse.interface';

@Component({
  selector: 'app-doctor-report-list',
  templateUrl: './doctor-report-list.component.html',
  styleUrls: ['./doctor-report-list.component.css'],
})
export class DoctorReportListComponent {
  reportData: ReportAppAdminResponseInterface = history.state.report;
  reportSummaryData: ReportAppAdminSummaryResponseInterface =
    this.reportData.summary;
  reportAppointmentData: AppointmentAdminGetInterface[] =
    this.reportData.appointments;
  allSummaryColumns: string[] = [
    'num_appointments',
    'num_patients',
    'num_doctors',
    'num_particular_insurances',
    'num_other_insurances',
    'total_patient_copayment',
    'total_hi_copayment',
    'doctor',
    'specialty',
    'branch',
    'payment_method',
    'health_insurance',
    'patient',
  ];

  // Filter not null columns
  displayedSummaryColumns: string[] = this.allSummaryColumns.filter(
    (column) => this.reportSummaryData[column] !== null
  );

  displayedAppointmentsColumns: string[] = [
    'doctor',
    'patient',
    'branch',
    'day',
    'hour',
    'health_insurance',
    //'specialty',
    //'duration',
    //'full_cost',
    'patient_copayment',
    'hi_copayment',
    'payment_method',
    'appointment_status',
    // 'payment_status',
  ];

  dataSummarySource!: MatTableDataSource<ReportAppAdminSummaryResponseInterface>;
  dataAppointmentSource!: MatTableDataSource<AppointmentAdminGetInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  /**
   * Initializes the component and sets the data table.
   * @author Alvaro Olguin
   */
  ngOnInit() {
    this.setSummaryDataTable();
    this.setAppointmentsDataTable();
  }

  /**
   * Sets the data table with the summary.
   * @author Alvaro Olguin
   */
  setSummaryDataTable() {
    this.dataSummarySource = new MatTableDataSource([this.reportData.summary]);
    this.dataSummarySource.paginator = this.paginator;
    this.dataSummarySource.sort = this.sort;
  }

  /**
   * Sets the data table with appointments detailed list.
   * @author Alvaro Olguin
   */
  setAppointmentsDataTable() {
    this.dataAppointmentSource = new MatTableDataSource(
      this.reportData.appointments
    );
    this.dataAppointmentSource.paginator = this.paginator;
    this.dataAppointmentSource.sort = this.sort;
  }

  /**
   * Applies a filter to the data source when an event is triggered.
   * @param {Event} event - The event that triggered the filter.
   * @author Alvaro Olguin
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataAppointmentSource.filter = filterValue.trim().toLowerCase();

    if (this.dataAppointmentSource.paginator) {
      this.dataAppointmentSource.paginator.firstPage();
    }
  }
}
