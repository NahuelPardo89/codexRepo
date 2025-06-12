import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';
import { AppointmentPatientGetInterface } from 'src/app/Models/appointments/get-interfaces/appointmentPatientGet.interface';
import { AppointmentService } from 'src/app/Services/appointments/appointment.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-appointment-patient-list',
  templateUrl: './appointment-patient-list.component.html',
  styleUrls: ['./appointment-patient-list.component.css'],
})
export class AppointmentPatientListComponent {
  displayedColumns: string[] = [
    'day',
    'hour',
    //'patient',
    'doctor',
    //'specialty',
    'branch',
    'health_insurance',
    'appointment_type',
    'appointment_status',
    'payment_status',
    'actions',
  ];

  dataSource!: MatTableDataSource<AppointmentPatientGetInterface>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  /**
   * Initializes the component and sets the data table.
   * @author Alvaro Olguin
   */
  ngOnInit(): void {
    this.setDataTable();
  }

  /**
   * Sets the data table with appointments. If a day is provided, it gets the patient's appointments for that day.
   * Otherwise, it gets all the patient's appointments.
   * @param {string} day - The day for which to get the patient's appointments.
   * @author Alvaro Olguin
   */
  setDataTable(day?: string) {
    let observable: Observable<AppointmentPatientGetInterface[]>;
    if (day) {
      observable = this.appointmentService.getPatientTodayAppointments(day);
    } else {
      observable = this.appointmentService.getPatientAppointments();
    }
    observable.subscribe((data: AppointmentPatientGetInterface[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.paginator._intl.itemsPerPageLabel = 'items por página';
      this.paginator._intl.firstPageLabel = 'primera página';
      this.paginator._intl.lastPageLabel = 'última página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Sets the data table with all the patient's appointments.
   * @author Alvaro Olguin
   */
  showAll() {
    this.setDataTable();
  }

  /**
   * Filters the patient's appointments for the current day and sets the data table.
   * @author Alvaro Olguin
   */
  filterToday() {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.setDataTable(today);
  }

  /**
   * Applies a filter to the data source when an event is triggered.
   * @param {Event} event - The event that triggered the filter.
   * @author Alvaro Olguin
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Checks if there are less than 24 hours left for the appointment.
   * @param {any} row - The object representing the medical appointment.
   * @returns {boolean} - Returns `true` if there are less than 24 hours left for the appointment. Otherwise, it returns `false`.
   * @author Alvaro Olguin
   */
  lessThan24Hours(row: any): boolean {
    let dateParts = row.day.split('-');
    let timeParts = row.hour.split(':');
    let appointmentDate = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0],
      +timeParts[0],
      +timeParts[1]
    );
    let currentDate = new Date();
    let differenceInHours =
      (appointmentDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60;
    return differenceInHours < 24;
  }

  /**
   * Determines whether an appointment can be deleted. An appointment can be deleted if its state is not 'Pagado' and its day is later than today.
   * @param {any} row - The row representing the appointment in the data table.
   * @returns {boolean} - Returns true if the appointment can be deleted, false otherwise.
   * @author Alvaro Olguin
   */
  canDelete(row: any): boolean {
    let dateParts = row.day.split('-');
    let formattedDate = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0]
    );
    return (
      row.appointment_status.toUpperCase() != 'PAGADO' &&
      formattedDate > new Date()
    );
  }

  /**
   * Deletes an appointment when its ID is provided. It opens a confirmation dialog before deleting the appointment.
   * If the deletion is confirmed, it sends a request to delete the appointment and updates the data table.
   * @param {number} appointment_id - The ID of the appointment to delete.
   * @author Alvaro Olguin
   */
  onDelete(appointment_id: number): void {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirma la eliminación de este turno?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.appointmentService
          .deletePatientAppointment(appointment_id)
          .pipe(
            catchError((error) => {
              console.error('Error en la solicitud:', error);

              // Checks "non_field_errors"
              if (error.error && error.error.non_field_errors) {
                const errorMessage = error.error.non_field_errors[0];
                this.dialogService.showErrorDialog(
                  'Error al eliminar el turno: ' + errorMessage
                );
              } else {
                // Show a general error
                this.dialogService.showErrorDialog(
                  'Ha ocurrido un error en la solicitud.'
                );
              }

              throw error;
            })
          )
          .subscribe((data: any) => {
            this.setDataTable();
            this.dialogService.showSuccessDialog('Turno eliminado con éxito');
          });
      }
    });
  }
}
