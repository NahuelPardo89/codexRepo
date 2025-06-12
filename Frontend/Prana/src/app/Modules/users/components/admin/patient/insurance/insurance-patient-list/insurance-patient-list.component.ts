import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InsurancePlanPatient } from 'src/app/Models/Profile/isurancePlanPatient.interface';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { InsurancePatientService } from 'src/app/Services/Profile/healthinsurance/insurancePatient/insurance-patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-insurance-patient-list',
  templateUrl: './insurance-patient-list.component.html',
  styleUrls: ['./insurance-patient-list.component.css']
})
export class InsurancePatientListComponent {
  
  patient!:Patient

  displayedColumns: string[] = [
    
    'insurance',
    'code',
    'actions',
    
  ];
  dataSource!: MatTableDataSource<InsurancePlanPatient>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private insurancePatientService:InsurancePatientService,
    private dialogService: DialogService,
    private router: Router
  ) {
    if (history.state.patient){
      this.patient = history.state.patient
      
    }
}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.insurancePatientService.getAllofPatient(this.patient.id).subscribe((data) => {
      //const filteredData = this.showInactive ? data : data.filter(d => d.is_active);
      
      this.dataSource = new MatTableDataSource(data);
      
      this.paginator._intl.itemsPerPageLabel = 'items por página';
      this.paginator._intl.firstPageLabel = 'primera página';
      this.paginator._intl.lastPageLabel = 'última página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';

      this.dataSource.paginator = this.paginator;
      this.sort.active = 'insurance'; // El nombre de la columna por la que quieres ordenar inicialmente
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

  insurancePatientCreate(){
    const patient=this.patient
    this.router.navigate(['Dashboard/accounts/pacientes/insurance/create'], {
      state: {patient},
    });
  }
  
  insurancePatientEdit(insurancePlanPatient:InsurancePlanPatient){
    const patient=this.patient
    this.router.navigate(['Dashboard/accounts/pacientes/insurance/edit'], {
      state: { insurancePlanPatient,patient },
    });
  }
  insuranceDelete(id:number){
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas Eliminar esta Obra Social del Paciente?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
   
      if (confirmResult) {
        this.insurancePatientService.delete(id).subscribe({
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
