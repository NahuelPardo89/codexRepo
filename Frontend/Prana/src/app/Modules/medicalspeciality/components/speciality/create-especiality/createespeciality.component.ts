import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-createespeciality',
  templateUrl: './createespeciality.component.html',
  styleUrls: ['./createespeciality.component.css'],
})
export class CreateespecialityComponent {
  specialityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specialityService: SpecialityService,
    private dialog: DialogService,
    private router: Router
  ) {
    this.specialityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.specialityForm.valid) {
      const nameInUpperCase = this.specialityForm
        .get('name')
        ?.value.toUpperCase();

      // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.specialityForm.get('name')?.setValue(nameInUpperCase);
      this.specialityService
        .createSpeciality(this.specialityForm.value)
        .subscribe({
          next: (response) => {
            this.dialog.showSuccessDialog('Especialidad creada correctamente');
            this.router.navigate(['/Dashboard/speciality/speciality']);
          },
          error: (error) => {
            this.dialog.showErrorDialog(error.error.message);
          },
          // Opcionalmente, puedes incluir 'complete' si necesitas manejar la finalización
        });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/speciality/speciality']);
  }
}
