import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-editmypatient',
  templateUrl: './editmypatient.component.html',
  styleUrls: ['./editmypatient.component.css']
})
export class EditmypatientComponent {
  patientForm!: FormGroup;
  patientName!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientService: PatientService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (history.state.patient) {
      this.patientName = history.state.patient.user;
      this.patientForm.patchValue(history.state.patient);
    }
  }

  private initForm() {
    this.patientForm = this.fb.group({
      facebook: [''],
      instagram: [''],
      address: [''],
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
           
      this.patientService.updateLoggedPatient( this.patientForm.value)
          .subscribe({
            next: () => {
              this.dialogService.showSuccessDialog(
                'Paciente Editado con éxito'
              );

              this.router.navigate(['Dashboard/accounts/myaccount']); // Ajusta la ruta según sea necesario
            },
            error: (error) => {
              console.log(error);
              this.dialogService.showErrorDialog(
                'Error al actualizar el Paciente'
              );
              // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
            },
          });
     
  }}
  onCancel() {
    this.router.navigate(['Dashboard/accounts/myaccount']);
  }
}


