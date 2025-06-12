import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SeminarInscriptionAdminGetDetailInterface } from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';

@Component({
  selector: 'app-seminar-inscription-admin-list',
  templateUrl: './seminar-inscription-admin-list.component.html',
  styleUrls: ['./seminar-inscription-admin-list.component.css'],
})
export class SeminarInscriptionAdminListComponent {
  displayedColumns: string[] = [
    'seminar',
    'patient',
    'seminar_status',
    'meetingNumber',
    'insurance',
    'patient_copayment',
    'hi_copayment',
    'payment_status',
    'payment_method',
    'actions',
  ];
  dataSource!: MatTableDataSource<SeminarInscriptionAdminGetDetailInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentSeminar: SeminarAdminInterface = history.state.seminar;
  constructor(
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
   * Sets the data table with the inscriptions data of a seminar.
   * @author Alvaro Olguin
   */
  setDataTable() {
    this.seminarInscriptionService
      .getSeminarInscriptionsDetailById(history.state.seminar.id)
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
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
   * Edits an inscription.
   * @param {number} seminarInscription - The inscription to edit
   *
   */
  onEdit(seminarInscription: SeminarAdminInterface) {
    let seminar = this.currentSeminar;
    this.router.navigate(
      ['/Dashboard/seminar/admin/seminar-inscription/update'],
      {
        state: { seminarInscription, seminar },
      }
    );
  }

  /**
   * Navigates to the seminar inscription creation route and passes the seminar as state.
   *
   * @param {SeminarAdminInterface} seminar - The seminar to which a participant will be added.
   * @author Alvaro Olguin Armendariz
   */
  addParticipant(seminar: SeminarAdminInterface) {
    this.router.navigate(
      ['/Dashboard/seminar/admin/seminar-inscription/create'],
      {
        state: { seminar },
      }
    );
  }

  /**
   * Redirects to the seminar inscription screen
   * @param {number} seminar_id - The ID of the seminar to view.
   * @author Alvaro Olguin
   */
  onView(seminar_id: SeminarAdminInterface) {
    this.router.navigate(['Dashboard/seminar/admin/seminar-inscription/list'], {
      state: { seminar_id },
    });
  }

  /**
   * Deletes a seminar inscription when its ID is provided. It opens a confirmation dialog before deleting.
   * If the deletion is confirmed, it sends a request to delete the seminar inscription and updates the data table.
   * @param {number} inscription_id - The ID of the seminar to delete.
   * @author Alvaro Olguin
   */
  onDelete(inscription_id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirma la eliminación de esta Inscripción? esta acción es irreversible'
    );
    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.seminarInscriptionService
          .deleteInscription(inscription_id)
          .pipe(
            catchError((error) => {
              console.error('Error en la solicitud:', error);
              // Checks "non_field_errors"
              if (error.error && error.error.non_field_errors) {
                const errorMessage = error.error.non_field_errors[0];
                this.dialogService.showErrorDialog(
                  'Error al desactivar el seminario: ' + errorMessage
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
            this.dialogService.showSuccessDialog(
              'Inscripción eliminada con éxito'
            );
          });
      }
    });
  }
}
