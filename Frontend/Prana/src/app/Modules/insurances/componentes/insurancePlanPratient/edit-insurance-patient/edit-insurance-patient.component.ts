import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InsurancePatientService } from 'src/app/Services/Profile/healthinsurance/insurancePatient/insurance-patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-insurance-patient',
  templateUrl: './edit-insurance-patient.component.html',
  styleUrls: ['./edit-insurance-patient.component.css']
})
export class EditInsurancePatientComponent {
  insurancePatientForm!: FormGroup;
  patientName!: string;
  insuranceName!: string;
  
    
    constructor(
    private fb: FormBuilder,
    private router: Router,
    private insurancePlanPatienteService: InsurancePatientService,
    private dialogService: DialogService,
    
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    if (history.state.insurancePlanPatient) {
      this.patientName = history.state.insurancePlanPatient.patient;
      this.insuranceName = history.state.insurancePlanPatient.insurance;
      this.insurancePatientForm.patchValue(history.state.insurancePlanPatient)
    }
  
  }

  private initForm() {
    this.insurancePatientForm = this.fb.group({
    code: ['', ],
   
    });
    
  }

  

  onSubmit(): void {
    if (this.insurancePatientForm.valid) {
      const isurancePatienttId = history.state.insurancePlanPatient ? history.state.insurancePlanPatient.id : null;
      if (isurancePatienttId) {
         this.insurancePlanPatienteService.update(isurancePatienttId, this.insurancePatientForm.value).subscribe({
          next: () => {
            this.dialogService.showSuccessDialog("Profesional Editado con éxito")
            this.router.navigate(['/Dashboard/insurances/patient']); 
          },
          error: (error) => {
           
            this.dialogService.showErrorDialog("Error al actualizar el Profesional")
            
          }
        });
      } else {
        console.error('Error: No se pudo obtener el ID del usuario para la actualización.');
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      console.log('El formulario no es válido');
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel(){
    this.router.navigate(['/Dashboard/insurances/patient'])
  }
  
}
