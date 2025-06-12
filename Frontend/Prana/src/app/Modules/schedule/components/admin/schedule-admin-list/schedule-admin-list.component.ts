import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

import { ScheduleAdminInterface } from 'src/app/Models/schedule/scheduleAdminInterface.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

import { ScheduleService } from 'src/app/Services/schedule/schedule.service';

/**
 * Component for managing seminar schedules in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
@Component({
  selector: 'app-schedule-admin-list',
  templateUrl: './schedule-admin-list.component.html',
  styleUrls: ['./schedule-admin-list.component.css'],
})
export class ScheduleAdminListComponent {
  displayedColumns: string[] = [
    'weekday',
    'start_hour',
    'end_hour',
    // 'is_active', should have this?
    'actions',
  ];
  dataSource!: MatTableDataSource<ScheduleAdminInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  /**
   * Initializes the component by setting up the data table.
   * @author Alvaro Olguin Armendariz
   */
  ngOnInit() {
    this.setDataTable();
  }

  /**
   * Sets up the data table with a list of seminar schedules retrieved from the ScheduleService.
   * @author Alvaro Olguin Armendariz
   */
  setDataTable() {
    this.scheduleService.getSchedules().subscribe((data) => {
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
   * Applies a filter to the data source when an input event is triggered.
   * @param {Event} event - The input event that triggered the filter.
   * @author Alvaro Olguin Armendariz
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Navigates to the schedule update page for the selected schedule.
   * @param {ScheduleAdminInterface} schedule - The schedule to be edited.
   * @author Alvaro Olguin Armendariz
   */
  onEdit(schedule: ScheduleAdminInterface) {
    this.router.navigate(['Dashboard/schedule/admin/update'], {
      state: { schedule },
    });
  }

  /**
   * Deletes a schedule after confirmation. If the deletion is confirmed,
   * it sends a request to delete the schedule and updates the data table.
   * @param {number} scheduleId - The ID of the schedule to delete.
   * @author Alvaro Olguin Armendariz
   */
  onDelete(scheduleId: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirma la eliminación de esta sala?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.scheduleService
          .deleteSchedule(scheduleId)
          .pipe(
            catchError((error) => {
              // Checks "error" for error message
              if (error.error && error.error.detail) {
                const errorMessage = error.error.detail;
                this.dialogService.showErrorDialog(
                  'Error al eliminar el horario: ' + errorMessage
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
            this.dialogService.showSuccessDialog('Horario eliminado con éxito');
          });
      }
    });
  }
}
