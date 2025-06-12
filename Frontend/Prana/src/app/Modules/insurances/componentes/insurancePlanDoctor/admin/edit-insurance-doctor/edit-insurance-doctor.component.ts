import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceDoctorService } from 'src/app/Services/Profile/healthinsurance/insuranceDoctor/insurance-doctor.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-insurance-doctor',
  templateUrl: './edit-insurance-doctor.component.html',
  styleUrls: ['./edit-insurance-doctor.component.css']
})
export class EditInsuranceDoctorComponent {
  insuranceDoctorForm!: FormGroup;
  doctorName!: string;
  insuranceName!: string;
  branchName!: string;
  
    
    constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceDoctorService: InsuranceDoctorService,
    private dialogService: DialogService,
    
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    if (history.state.insurancePlanDoctor) {
      this.doctorName = history.state.insurancePlanDoctor.doctor;
      this.insuranceName = history.state.insurancePlanDoctor.insurance;
      this.branchName = history.state.insurancePlanDoctor.branch;
      this.insuranceDoctorForm.patchValue(history.state.insurancePlanDoctor)
    }
  
  }

  private initForm() {
    this.insuranceDoctorForm = this.fb.group({
    price: ['', ],
   
    });
    
  }

  

  onSubmit(): void {
    if (this.insuranceDoctorForm.valid) {
      const insuranceDoctorId = history.state.insurancePlanDoctor ? history.state.insurancePlanDoctor.id : null;
      if (insuranceDoctorId) {
         this.insuranceDoctorService.update(insuranceDoctorId, this.insuranceDoctorForm.value).subscribe({
          next: () => {
            this.dialogService.showSuccessDialog("Obra Social Editada con éxito")
            this.router.navigate(['/Dashboard/insurances/doctor']); 
          },
          error: (error) => {
          
            this.dialogService.showErrorDialog("Error al actualizar la Obra Social")
            
          }
        });
      } else {
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel(){
    this.router.navigate(['/Dashboard/insurances/doctor'])
  }
}
