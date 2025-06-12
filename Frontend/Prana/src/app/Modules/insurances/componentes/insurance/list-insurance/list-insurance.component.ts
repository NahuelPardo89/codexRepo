import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-list-insurance',
  templateUrl: './list-insurance.component.html',
  styleUrls: ['./list-insurance.component.css'],
})
export class ListInsuranceComponent {
  displayedColumns: string[] = ['name', 'is_active', 'actions'];
  dataSource!: MatTableDataSource<HealthInsurance>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showInactive: boolean = false;

  constructor(
    private insuranceService: HealthinsuranceService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.insuranceService.getAll().subscribe((data) => {
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
  insuranceEdit(insurance: HealthInsurance) {
    this.router.navigate(['Dashboard/insurances/insurance/edit'], {
      state: { insurance },
    });
  }
  insuranceDelete(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar esta Obra Social?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.insuranceService.delete(id).subscribe({
          next: () => {
            // Manejo de la respuesta de eliminación exitosa
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Obra Social Desactivado con éxito'
            );

            // Aquí podrías, por ejemplo, recargar la lista de usuarios
          },
          error: (error) => {
            // Manejo de errores
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar la Obra Social'
            );
          },
        });
      }
    });
  }
  activeInsurance(insurance: HealthInsurance) {
    insurance.is_active = true;

    this.insuranceService.update(insurance.id, insurance).subscribe({
      next: () => {
        this.dialogService.showSuccessDialog('Obra Social Activada con éxito');

        this.setDataTable();
      },
      error: (error) => {
        this.dialogService.showErrorDialog('Error al Activar Obra Social');
        // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
      },
    });
  }
}
