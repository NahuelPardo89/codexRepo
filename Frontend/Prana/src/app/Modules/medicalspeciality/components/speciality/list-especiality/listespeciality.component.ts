import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-listespeciality',
  templateUrl: './listespeciality.component.html',
  styleUrls: ['./listespeciality.component.css'],
})
export class ListespecialityComponent {
  specialities: Medicalspeciality[] = [];
  displayedColumns: string[] = [ 'name', 'is_active', 'actions'];
  dataSource!: MatTableDataSource<Medicalspeciality>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showInactive: boolean = false;

  constructor(
    private specialityService: SpecialityService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.specialityService.getSpecialities().subscribe((data) => {
      const filteredData = this.showInactive
        ? data
        : data.filter((d) => d.is_active);

      this.dataSource = new MatTableDataSource(filteredData);

      this.paginator._intl.itemsPerPageLabel = 'items por página';
      this.paginator._intl.firstPageLabel = 'primera página';
      this.paginator._intl.lastPageLabel = 'última página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';

      this.dataSource.paginator = this.paginator;
      this.sort.active = 'name'; // El nombre de la columna por la que quieres ordenar inicialmente
      this.sort.direction = 'asc';
      this.dataSource.sort = this.sort;
      // Puede ser 'asc' o 'desc'
    });
  }
  onShowInactiveChange() {
    this.setDataTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  especialityEdit(speciality: Medicalspeciality) {
    this.router.navigate(['Dashboard/speciality/speciality/edit'], {
      state: { speciality },
    });
  }
  especialityDelete(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar esta Especialidad?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.specialityService.deleteSpeciality(id).subscribe({
          next: () => {
            // Manejo de la respuesta de eliminación exitosa
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Especialidad Desactivada con éxito'
            );

            // Aquí podrías, por ejemplo, recargar la lista de usuarios
          },
          error: (error) => {
            // Manejo de errores
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar la Especialidad'
            );
          },
        });
      }
    });
  }
  activeEspeciality(especiality: Medicalspeciality) {
    especiality.is_active = true;

    this.specialityService
      .updateSpeciality(especiality.id, especiality)
      .subscribe({
        next: () => {
      
          this.dialogService.showSuccessDialog(
            'Obra Social Activada con éxito'
          );

          this.setDataTable();
        },
        error: (error) => {
          console.error('Error al actualizar obra social', error);
          this.dialogService.showErrorDialog('Error al Activar Obra Social');
          // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
        },
      });
  }
}
