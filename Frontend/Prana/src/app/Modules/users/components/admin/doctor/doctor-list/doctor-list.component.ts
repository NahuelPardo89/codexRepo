import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
})
export class DoctorListComponent {
  displayedColumns: string[] = [
    'user',
    'medicLicence',
    'specialty',
    'appointment_duration',
    'is_active',
    'actions',
  ];
  dataSource!: MatTableDataSource<DoctorProfile>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private doctorService: DoctorprofileService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.doctorService.getDoctors().subscribe((data) => {
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

  editDoctor(doctor: DoctorProfile) {
    this.router.navigate(['Dashboard/accounts/doctores/edit'], {
      state: { doctor },
    });
  }

  doctorSchedule(doctor: DoctorProfile) {
    this.router.navigate(['Dashboard/accounts/doctores/schedule/'], {
      state: { doctor },
    });
  }
  doctorInsurance(doctor: DoctorProfile) {
    this.router.navigate(['Dashboard/accounts/doctores/insurance/'], {
      state: { doctor },
    });
  }

  deleteDoctor(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar este Profesional?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      console.log('eliminar usuario');
      if (confirmResult) {
        this.doctorService.deleteDoctor(id).subscribe({
          next: () => {
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Profesional Desactivado con éxito'
            );
          },
          error: (error) => {
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar el Profesional'
            );
          },
        });
      }
    });
  }

  activeDoctor(doctor: DoctorProfile) {
    const dataToUpdate = { is_active: true };
    this.doctorService.partialupdateDoctor(doctor.id, dataToUpdate).subscribe({
      next: () => {
        this.dialogService.showSuccessDialog('Profesional Activado con éxito');
        this.setDataTable();
      },
      error: (error) => {
        this.dialogService.showErrorDialog('Error al Activar el Profesional');
      },
    });
  }
}
