import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { InsurancePlanDoctor } from 'src/app/Models/Profile/insurancePlanDoctor.interface';
import { InsuranceDoctorService } from 'src/app/Services/Profile/healthinsurance/insuranceDoctor/insurance-doctor.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-insurance-doctor-list',
  templateUrl: './insurance-doctor-list.component.html',
  styleUrls: ['./insurance-doctor-list.component.css']
})
export class InsuranceDoctorListComponent {
  doctorName=""
  doctorId!:number
  doctor!:DoctorProfile
  displayedColumns: string[] = [
    
    'insurance',
    'branch',
    'price',
    'actions',
    
  ];
  dataSource!: MatTableDataSource<InsurancePlanDoctor>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private insuranceDoctorService:InsuranceDoctorService,
    private dialogService: DialogService,
    private router: Router
  ) {
    if (history.state.doctor) {
      
      this.doctorName = history.state.doctor.user;
      this.doctorId = history.state.doctor.id
      this.doctor=history.state.doctor
    }
  }

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.insuranceDoctorService.getAllofDoctor(this.doctorId).subscribe((data) => {
      
      
      this.dataSource = new MatTableDataSource(data);
      
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
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  insuranceDoctorCreate(){
    const doctor=this.doctor
    this.router.navigate(['Dashboard/accounts/doctores/insurance/create'], {
      state: {doctor},
    });
  }
  insuranceDoctorEdit(insurancePlanDoctor:InsurancePlanDoctor){
    const doctor=this.doctor
    this.router.navigate(['Dashboard/accounts/doctores/insurance/edit'], {
      state: { insurancePlanDoctor,doctor },
    });
  }
  insuranceDelete(id:number){
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas Eliminar esta Obra Social del Profesional?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      
      if (confirmResult) {
        this.insuranceDoctorService.delete(id).subscribe({
          next: () => {
            // Manejo de la respuesta de eliminación exitosa
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Obra Social Eliminada con éxito'
            );

            // Aquí podrías, por ejemplo, recargar la lista de usuarios
          },
          error: (error) => {
            // Manejo de errores
            this.dialogService.showErrorDialog(
              'Hubo un error al Eliminar la Obra Social'
            );
          },
        });
      }
    });
  }
}
