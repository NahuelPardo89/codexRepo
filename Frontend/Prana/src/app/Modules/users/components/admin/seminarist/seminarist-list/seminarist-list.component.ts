import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  SeminaristProfileDisplayInterface,
  SeminaristProfileFlatInterface,
} from 'src/app/Models/Profile/seminaristProfile.interface';

import { SeminaristService } from 'src/app/Services/Profile/seminarist/seminarist.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-seminarist-list',
  templateUrl: './seminarist-list.component.html',
  styleUrls: ['./seminarist-list.component.css'],
})
export class SeminaristListComponent {
  displayedColumns: string[] = ['user', 'is_active', 'actions'];
  dataSource!: MatTableDataSource<SeminaristProfileDisplayInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seminaristService: SeminaristService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.seminaristService.getSeminaristsDisplay().subscribe((data) => {
      console.log(data);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editSeminarist(seminarist: SeminaristProfileFlatInterface) {
    this.router.navigate(['Dashboard/accounts/doctores/edit'], {
      state: { seminarist },
    });
  }

  deleteSeminarist(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar este Tallerista?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      console.log('eliminar usuario');
      if (confirmResult) {
        this.seminaristService.deleteSeminarist(id).subscribe({
          next: () => {
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Tallerista Desactivado con éxito'
            );
          },
          error: (error) => {
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar el Tallerista'
            );
          },
        });
      }
    });
  }

  activeDoctor(seminarist: SeminaristProfileFlatInterface) {
    const dataToUpdate = { is_active: true };
    const id = seminarist.id || 0;
    this.seminaristService.partialupdateSeminarist(id, dataToUpdate).subscribe({
      next: () => {
        this.dialogService.showSuccessDialog('Tallerista Activado con éxito');
        this.setDataTable();
      },
      error: (error) => {
        this.dialogService.showErrorDialog('Error al Activar el Tallerista');
        // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
      },
    });
  }
}
