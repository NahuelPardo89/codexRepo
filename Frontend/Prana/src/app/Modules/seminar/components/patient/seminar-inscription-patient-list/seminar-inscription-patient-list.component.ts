import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SeminarInscriptionAdminGetDetailInterface } from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';

@Component({
  selector: 'app-seminar-inscription-patient-list',
  templateUrl: './seminar-inscription-patient-list.component.html',
  styleUrls: ['./seminar-inscription-patient-list.component.css'],
})
export class SeminarInscriptionPatientListComponent {
  displayedColumns: string[] = [
    'seminar',
    'patient',
    'seminar_status',
    'meetingNumber',
    'insurance',
    //'patient_copayment',
    //'hi_copayment',
    //'payment_status',
    //'payment_method',
    'actions',
  ];
  dataSource!: MatTableDataSource<SeminarInscriptionAdminGetDetailInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentSeminar: SeminarAdminInterface = history.state.seminar;
  constructor(
    private seminarInscriptionService: SeminarInscriptionService,
    private patientService: PatientService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  /**
   * Initializes the component and sets the data table.
   * @author Alvaro Olguin
   */
  ngOnInit() {
    this.setDataTable();
  }

  /**
   * Sets the data table with the inscriptions data of a seminar.
   * @author Alvaro Olguin
   */
  setDataTable() {
    this.patientService.getCurrentPatient().subscribe((data) => {
      this.seminarInscriptionService
        .getPatientSeminarInscriptions(data.id)
        .subscribe((patientData) => {
          this.dataSource = new MatTableDataSource(patientData);
          this.paginator._intl.itemsPerPageLabel = 'items por página';
          this.paginator._intl.firstPageLabel = 'primera página';
          this.paginator._intl.lastPageLabel = 'última página';
          this.paginator._intl.nextPageLabel = 'página siguiente';
          this.paginator._intl.previousPageLabel = 'página anterior';
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    });
  }

  /**
   * Applies a filter to the data source when an event is triggered.
   * @param {Event} event - The event that triggered the filter.
   * @author Alvaro Olguin
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Deletes a seminar inscription when its ID is provided. It opens a confirmation dialog before deleting.
   * If the deletion is confirmed, it sends a request to delete the seminar inscription and updates the data table.
   * @param {number} inscription_id - The ID of the seminar to delete.
   * @author Alvaro Olguin
   */
  onDelete(inscription_id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirmas que deseas solicitar la baja de este taller?'
    );
    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.seminarInscriptionService
          .deletePatientInscription(inscription_id)
          .pipe(
            catchError((error) => {
              console.error('Error en la solicitud:', error);
              // Checks "non_field_errors"
              if (error.error && error.error.non_field_errors) {
                const errorMessage = error.error.non_field_errors[0];
                this.dialogService.showErrorDialog(
                  'Ha ocurrido un error al intentar procesar la solicitud de baja de la inscripción: ' +
                    errorMessage
                );
              } else {
                // Show a general error
                this.dialogService.showErrorDialog(
                  'Se ha producido un error durante el procesamiento de tu solicitud de baja.'
                );
              }
              throw error;
            })
          )
          .subscribe((data: any) => {
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Tu solicitud de baja ha sido procesada exitosamente <br>' +
                data.message
            );
          });
      }
    });
  }
}
