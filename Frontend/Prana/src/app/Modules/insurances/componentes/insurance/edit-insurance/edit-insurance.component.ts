import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.css']
})
export class EditInsuranceComponent {
  insuranceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceService: HealthinsuranceService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (history.state.insurance) {
      this.insuranceForm.patchValue(history.state.insurance);
    }
  }

  private initForm() {
    this.insuranceForm = this.fb.group({

      name: ['', Validators.required],

    });
  }

  onSubmit(): void {
    if (this.insuranceForm.valid) {
      // Obtén el ID del usuario que se está editando
      const insuranceId = history.state.insurance ? history.state.insurance.id : null;
      if (insuranceId) {
        const nameInUpperCase = this.insuranceForm.get('name')?.value.toUpperCase();

        // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
        this.insuranceForm.get('name')?.setValue(nameInUpperCase);
        this.insuranceService.update(insuranceId, this.insuranceForm.value).subscribe({
          next: () => {
      
            this.dialogService.showSuccessDialog('Obra Social Editada con éxito');

            this.router.navigate(['Dashboard/insurances/insurance']); // Ajusta la ruta según sea necesario
          },
          error: (error) => {
         
            this.dialogService.showErrorDialog(
              'Error al actualizar Obra Social'
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
    this.router.navigate(['Dashboard/insurances/insurance']);
  }
}
