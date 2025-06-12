import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-create-insurance',
  templateUrl: './create-insurance.component.html',
  styleUrls: ['./create-insurance.component.css']
})
export class CreateInsuranceComponent {
  insuranceForm: FormGroup;

  constructor(private fb: FormBuilder, private insuranceService: HealthinsuranceService, private dialog:DialogService, private router: Router) {
    this.insuranceForm = this.fb.group({
      
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.insuranceForm.valid) {
      const nameInUpperCase = this.insuranceForm.get('name')?.value.toUpperCase();

    // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.insuranceForm.get('name')?.setValue(nameInUpperCase);
      this.insuranceService.create(this.insuranceForm.value).subscribe({
        next: (response) => {
          this.dialog.showSuccessDialog("Obra Social creada correctamente");
          this.router.navigate(['/Dashboard/insurances/insurance']);
          
        },
        error: (error) => {
          this.dialog.showErrorDialog(error.error.message);
        }
        // Opcionalmente, puedes incluir 'complete' si necesitas manejar la finalización
      });
    }
  }
  onCancel(){
    this.router.navigate(['/Dashboard/insurances/insurance']);
  }

}
