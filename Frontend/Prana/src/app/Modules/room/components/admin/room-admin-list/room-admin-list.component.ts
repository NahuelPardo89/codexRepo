import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { RoomAdminInterface } from 'src/app/Models/room/admin/roomAdminInterface.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { RoomService } from 'src/app/Services/room/room.service';

@Component({
  selector: 'app-room-admin-list',
  templateUrl: './room-admin-list.component.html',
  styleUrls: ['./room-admin-list.component.css'],
})

/**
 * Component for managing rooms in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
export class RoomAdminListComponent {
  displayedColumns: string[] = [
    'name',
    'capacity',
    'cost',
    // 'is_active', should have this?
    'actions',
  ];
  dataSource!: MatTableDataSource<RoomAdminInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roomService: RoomService,
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
   * Sets up the data table with a list of rooms retrieved from the RoomService.
   * @author Alvaro Olguin Armendariz
   */
  setDataTable() {
    this.roomService.getRooms().subscribe((data) => {
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
   * Navigates to the room update page for the selected room.
   * @param {RoomAdminInterface} room - The room to be edited.
   * @author Alvaro Olguin Armendariz
   */
  onEdit(room: RoomAdminInterface) {
    this.router.navigate(['Dashboard/room/admin/update'], {
      state: { room },
    });
  }

  /**
   * Deletes a room after confirmation. If the deletion is confirmed, it sends a request to delete the room and updates the data table.
   * @param {number} roomId - The ID of the room to delete.
   * @author Alvaro Olguin Armendariz
   */
  onDelete(roomId: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Confirma la eliminación de esta sala?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.roomService
          .deleteRoom(roomId)
          .pipe(
            catchError((error) => {
              // Checks "error" for error message
              if (error.error && error.error.detail) {
                const errorMessage = error.error.detail;
                this.dialogService.showErrorDialog(
                  'Error al eliminar la sala: ' + errorMessage
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
            this.dialogService.showSuccessDialog('Sala eliminada con éxito');
          });
      }
    });
  }
}
