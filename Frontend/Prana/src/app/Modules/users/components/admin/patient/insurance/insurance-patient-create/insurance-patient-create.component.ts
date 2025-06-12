import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { InsurancePatientService } from 'src/app/Services/Profile/healthinsurance/insurancePatient/insurance-patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-insurance-patient-create',
  templateUrl: './insurance-patient-create.component.html',
  styleUrls: ['./insurance-patient-create.component.css']
})
export class InsurancePatientCreateComponent {
  patient!: Patient ;
  insurances: HealthInsurance[]= [];
  
  insurancePatientForm: FormGroup;
 
  constructor(
    
    private insuranceService: HealthinsuranceService,
    private insurancePatientService: InsurancePatientService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router,
  ) {
    if(history.state.patient){
      this.patient = history.state.patient
      
    }
    this.insurancePatientForm = this.fb.group({
     
      insurance: ['', Validators.required],
      code: ['', ],
      
      
    });
    
  }
  ngOnInit(): void {
    
    this.loadInsurance();
    
  }

 

  loadInsurance():void{
    this.insuranceService.getAll().subscribe(data=>{
      this.insurances = data
      
    })
  }

  
  
 
  onSubmit(): void {
    if (this.insurancePatientForm.valid) {
      const patientid =this.patient.id
      const insurancePlanPatient=this.insurancePatientForm.value
      insurancePlanPatient.patient=patientid
     
      
      this.insurancePatientService.create(insurancePlanPatient).subscribe({
        next: (response) => {
              this.dialog.showSuccessDialog("Obra Social agregada correctamente");
              const patient=history.state.patient
              this.router.navigate(['Dashboard/accounts/pacientes/insurance/'], {
                state: {patient},
              }); 
              
            },
            error: (error) => {
             
              this.dialog.showErrorDialog(error.error.message);
            }
           
          });
        
    } 
  }
  
  onCancel(): void{
    const patient=history.state.patient
    this.router.navigate(['Dashboard/accounts/pacientes/insurance/'], {
      state: {patient},
    }); 
  }
}
