import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SeminarInscriptionPatientPostInterface } from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';
import { SeminarService } from 'src/app/Services/seminar/seminar.service';

@Component({
  selector: 'app-seminar-patient-list',
  templateUrl: './seminar-patient-list.component.html',
  styleUrls: ['./seminar-patient-list.component.css'],
})
export class SeminarPatientListComponent {
  displayedColumns: string[] = [
    'name',
    'year',
    'month',
    'schedule',
    'meetingNumber',
    'maxInscription',
    'price',
    //'rooms',
    'seminarist',
    //'is_active',
    'actions',
  ];
  dataSource!: MatTableDataSource<SeminarAdminInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seminarService: SeminarService,
    private patientService: PatientService,
    private seminarInscriptionService: SeminarInscriptionService,
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
   * Sets the data table with seminars detailed list.
   * @author Alvaro Olguin
   */
  setDataTable() {
    this.seminarService.getSeminarsList().subscribe((data) => {
      // Show only active seminars to patient
      let activeSeminars = data.filter((seminar) => seminar.is_active);
      this.dataSource = new MatTableDataSource(activeSeminars);
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
   * Registers a patient for a seminar by creating a seminar inscription
   * request and displaying success or error messages accordingly.
   * @param {SeminarAdminInterface} currentSeminar - The currentSeminar parameter is of type
   * SeminarAdminInterface.
   * @author Alvaro Olguin
   */
  onRegister(currentSeminar: SeminarAdminInterface): void {
    this.patientService.getCurrentPatient().subscribe((data) => {
      if (currentSeminar.id) {
        const filteredBody: SeminarInscriptionPatientPostInterface = {
          seminar: currentSeminar.id,
          patient: data.id,
          meetingNumber: 1,
        };
        //console.log('BODY: ', filteredBody);

        const confirmAppointment = this.dialogService.openConfirmDialog(
          'Se enviará una solicitud de inscripción al taller'
        );
        confirmAppointment.afterClosed().subscribe((confirmResult) => {
          if (confirmResult) {
            this.seminarInscriptionService
              .createPatientSeminarInscription(filteredBody)
              .pipe(
                catchError((error) => {
                  console.error('Error en la solicitud:', error);

                  // Checks "non_field_errors"
                  if (error.error && error.error.non_field_errors) {
                    const errorMessage = error.error.non_field_errors[0];
                    this.dialogService.showErrorDialog(
                      'Error al crear la solicitud de inscripción: ' +
                        errorMessage
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
                const successDialog = this.dialogService.showSuccessDialog(
                  '¡Buenas noticias! Tu solicitud de inscripción se ha creado exitosamente. Puedes ver el estado actual de tu inscripción en el panel "Mis Inscripciones".'
                );

                successDialog.afterClosed().subscribe(() => {
                  this.router.navigate([
                    '/Dashboard/seminar/patient/seminar-inscription/list',
                  ]);
                });
              });
          }
        });
      }
    });
  }
}
