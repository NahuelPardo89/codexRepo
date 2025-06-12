import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css'],
})
export class PatientEditComponent {
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
      // Obtén el ID del usuario que se está editando
      const patientId = history.state.patient ? history.state.patient.id : null;
      if (patientId) {
        this.patientService
          .updatePatient(patientId, this.patientForm.value)
          .subscribe({
            next: () => {
              this.dialogService.showSuccessDialog(
                'Paciente Editado con éxito'
              );

              this.router.navigate(['Dashboard/accounts/pacientes/']); // Ajusta la ruta según sea necesario
            },
            error: (error) => {
              this.dialogService.showErrorDialog(
                'Error al actualizar el Paciente'
              );
              // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
            },
          });
      } else {
        this.dialogService.showErrorDialog(
          'Error: No se pudo obtener el ID del usuario para la actualización.'
        );
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel() {
    this.router.navigate(['Dashboard/accounts/pacientes']);
  }
}
