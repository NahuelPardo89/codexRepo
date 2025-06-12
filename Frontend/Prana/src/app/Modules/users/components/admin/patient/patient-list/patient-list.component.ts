import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent {
  displayedColumns: string[] = [
    'user',
    'facebook',
    'instagram',
    'address',
    'is_active',
    'insurances',
    'actions',
  ];
  dataSource!: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private dialogService: DialogService,
    private router: Router
  ) {}
  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.patientService.getAllPatients().subscribe((data) => {
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
  editPatient(patient: Patient) {
    this.router.navigate(['Dashboard/accounts/pacientes/edit'], {
      state: { patient },
    });
  }

  deletePatient(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar este Paciente?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.patientService.deletePatient(id).subscribe({
          next: () => {
            // Manejo de la respuesta de eliminación exitosa
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Paciente Desactivado con éxito'
            );

            // Aquí podrías, por ejemplo, recargar la lista de usuarios
          },
          error: (error) => {
            // Manejo de errores
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar el PAciente'
            );
          },
        });
      }
    });
  }

  activePatient(patient: Patient) {
    patient.is_active = true;

    this.patientService.updatePatient(patient.id, patient).subscribe({
      next: () => {
        this.dialogService.showSuccessDialog('Paciente Activado con éxito');

        this.setDataTable();
      },
      error: (error) => {
        console.log(error);
        this.dialogService.showErrorDialog('Error al Activar el Paciente');
        // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
      },
    });
  }
  patientInsurance(patient: Patient) {
    this.router.navigate(['Dashboard/accounts/pacientes/insurance/'], {
      state: { patient },
    });
  }
}
