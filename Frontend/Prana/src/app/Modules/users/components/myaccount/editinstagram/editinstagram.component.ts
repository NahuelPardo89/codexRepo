import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-editinstagram',
  templateUrl: './editinstagram.component.html',
  styleUrls: ['./editinstagram.component.css']
})
export class EditinstagramComponent implements OnInit {

  constructor(private patientService: PatientService, private fb: FormBuilder, private dialogService: DialogService) {}

  dataSource!: MatTableDataSource<Patient>;

  patientForm!: FormGroup;

  webInstagram: string = '';
  userPranaId: number = 0;

  getIg = () => {
    this.patientService.getAllPatients().subscribe((data: Patient[]) => {
      
      this.dataSource = new MatTableDataSource(data);
      const filterValue = 'PRANA';
      
      this.dataSource.filter = filterValue.trim();
      
      this.webInstagram = this.dataSource.filteredData[0].instagram;
      this.userPranaId = this.dataSource.filteredData[0].id;
      
     
    });

  }

  ngOnInit(): void {
    this.getIg();
    this.createForm();
  }

  createForm() {
    this.patientForm = this.fb.group({
      facebook: [''],
      instagram: [''],
      address: [''],
    });
  }

  editPatient() {
    const patientData = this.patientForm.value;
    this.patientService.updatePatient(this.userPranaId, patientData).subscribe(
      (updatedPatient) => {
        console.log('Paciente actualizado:', updatedPatient);
        // Mostrar el diálogo de éxito
        this.dialogService.showSuccessDialog('Cuenta de Instagram guardada con éxito');
      },
      (error) => {
        console.error('Error al actualizar el paciente:', error);
        // Manejar errores aquí, si es necesario
      }
    );
  }
}
