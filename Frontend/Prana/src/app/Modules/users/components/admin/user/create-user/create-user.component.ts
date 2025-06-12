import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private patientService: PatientService,
    private dialog: DialogService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      dni: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      is_staff: [false],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const nameInUpperCase = this.userForm.get('name')?.value.toUpperCase();
      const lastNameInUpperCase = this.userForm
        .get('last_name')
        ?.value.toUpperCase();

      // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.userForm.get('name')?.setValue(nameInUpperCase);
      this.userForm.get('last_name')?.setValue(lastNameInUpperCase);

      this.userService.createUser(this.userForm.value).subscribe({
        next: (response: any) => {
          // Recover the patient, in case to charge health insurances
          this.patientService
            .getPatientById(response.patient_id)
            .subscribe((data) => {
              const successDialog = this.dialog.showSuccessDialog(
                'Usuario creado correctamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const loadHealthInsurance = this.dialog.openConfirmDialog(
                  '¿Desea cargar las obras sociales para el perfil de paciente de este usuario?'
                );
                loadHealthInsurance.afterClosed().subscribe((confirmResult) => {
                  if (confirmResult) {
                    this.router.navigate(
                      ['Dashboard/accounts/pacientes/insurance/'],
                      {
                        state: { patient: data },
                      }
                    );
                  } else {
                    this.router.navigate(['/Dashboard/accounts/users']);
                  }
                });
              });
            });
        },
        error: (error: HttpErrorResponse) => {
          // Aquí manejas el error basado en el mensaje específico
          if (error.error.message.includes('DNI')) {
            //this.dialog.showErrorDialog("Ya existe un usuario con ese DNI.");
            this.userForm.controls['dni'].setErrors({ dniExists: true });
          } else if (error.error.message.includes('email')) {
            //this.dialog.showErrorDialog("Ya existe un usuario con ese email.");
            this.userForm.controls['email'].setErrors({ emailExists: true });
          } else {
            // Para otros tipos de errores no esperados
            this.dialog.showErrorDialog('Error al crear el usuario.');
          }
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/Dashboard/accounts/users']);
  }
}
