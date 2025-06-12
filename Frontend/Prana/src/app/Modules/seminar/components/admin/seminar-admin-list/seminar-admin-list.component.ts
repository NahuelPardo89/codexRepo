import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { SeminarService } from 'src/app/Services/seminar/seminar.service';

@Component({
  selector: 'app-seminar-admin-list',
  templateUrl: './seminar-admin-list.component.html',
  styleUrls: ['./seminar-admin-list.component.css'],
})
export class SeminarAdminListComponent {
  displayedColumns: string[] = [
    'name',
    'year',
    'month',
    'schedule',
    'meetingNumber',
    'maxInscription',
    'price',
    'rooms',
    'seminarist',
    'is_active',
    'actions',
  ];
  dataSource!: MatTableDataSource<SeminarAdminInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seminarService: SeminarService,
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
   * Activates a seminar by updating its 'is_active' status to true.
   *
   * @param {SeminarAdminInterface} seminar - The seminar to be activated.
   * @throws {Error} Throws an error if the activation process fails.
   * @returns {void}
   * @author Alvaro Olguin Armendariz
   */
  activateSeminar(seminar: SeminarAdminInterface): void {
    const data = { is_active: true };
    if (seminar.id) {
      this.seminarService
        .partialUpdateSeminar(seminar.id, data)
        .pipe(
          catchError((error) => {
            console.error('Error en la solicitud:', error);

            // Checks "non_field_errors"
            if (error.error && error.error.non_field_errors) {
              const errorMessage = error.error.non_field_errors[0];
              this.dialogService.showErrorDialog(
                'Error al activar el seminario: ' + errorMessage
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
          this.dialogService.showSuccessDialog('Seminario activado con éxito');
        });
    }
  }

  /**
   * Edits a seminar.
   * @param {number} seminar - The seminar to edit
   * @author Alvaro Olguin
   */
  onEdit(seminar: SeminarAdminInterface) {
    this.router.navigate(['Dashboard/seminar/admin/update'], {
      state: { seminar },
    });
  }

  /**
   * Redirects to the seminar inscription screen
   * @param {SeminarAdminInterface} seminar - The ID of the seminar to view.
   * @author Alvaro Olguin
   */
  onView(seminar: SeminarAdminInterface) {
    this.router.navigate(['Dashboard/seminar/admin/seminar-inscription/list'], {
      state: { seminar },
    });
  }

  /**
   * Deletes a seminar when its ID is provided. It opens a confirmation dialog before deleting.
   * If the deletion is confirmed, it sends a request to delete the seminar and updates the data table.
   * @param {number} seminar_id - The ID of the seminar to delete.
   * @author Alvaro Olguin
   */
  onDelete(seminar_id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirma la desactivación de este Taller?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.seminarService
          .deleteSeminar(seminar_id)
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
              'Seminario desactivado con éxito'
            );
          });
      }
    });
  }
}
