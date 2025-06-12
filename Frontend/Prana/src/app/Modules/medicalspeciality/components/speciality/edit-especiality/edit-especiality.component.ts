import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-especiality',
  templateUrl: './edit-especiality.component.html',
  styleUrls: ['./edit-especiality.component.css'],
})
export class EditEspecialityComponent {
  specialityForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private specialityService: SpecialityService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (history.state.speciality) {
      this.specialityForm.patchValue(history.state.speciality);
    }
  }

  private initForm() {
    this.specialityForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.specialityForm.valid) {
      // Obtén el ID del usuario que se está editando
      const specialityId = history.state.speciality
        ? history.state.speciality.id
        : null;
      if (specialityId) {
        const nameInUpperCase = this.specialityForm
          .get('name')
          ?.value.toUpperCase();

        // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
        this.specialityForm.get('name')?.setValue(nameInUpperCase);
        this.specialityService
          .updateSpeciality(specialityId, this.specialityForm.value)
          .subscribe({
            next: () => {
              this.dialogService.showSuccessDialog(
                'Especialidad Editada con éxito'
              );

              this.router.navigate(['Dashboard/speciality/speciality']); // Ajusta la ruta según sea necesario
            },
            error: (error) => {
       
              this.dialogService.showErrorDialog(
                'Error al actualizar Especialidad'
              );
              // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
            },
          });
      } else {
        console.error(
          'Error: No se pudo obtener el ID Obra Social para la actualización.'
        );
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      console.log('El formulario no es válido');
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel() {
    this.router.navigate(['Dashboard/speciality/speciality']);
  }
}
