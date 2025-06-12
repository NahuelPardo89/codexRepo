import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { InsuranceDoctorService } from 'src/app/Services/Profile/healthinsurance/insuranceDoctor/insurance-doctor.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-insurance-doctor-create',
  templateUrl: './insurance-doctor-create.component.html',
  styleUrls: ['./insurance-doctor-create.component.css']
})
export class InsuranceDoctorCreateComponent {
  doctorId=0
  doctorName=""
  insurances: HealthInsurance[]= [];
  branchs:SpecialityBranch[]= [];
  
  insuranceDoctorForm: FormGroup;
  
  showBranch: boolean = false;
  constructor(
   
    private insuranceService: HealthinsuranceService,
    private insuranceDoctorService: InsuranceDoctorService,
    private specialityBranchService: BranchService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router,
  ) {
    if (history.state.doctor){
      
      this.doctorId = history.state.doctor.id
      this.doctorName= history.state.doctor.user
    }
    this.insuranceDoctorForm = this.fb.group({
      
      insurance: ['', Validators.required],
      branch: ['',Validators.required ],
      price: ['', [Validators.required, Validators.min(0)]]

      
      
    });
    
  }
  
  ngOnInit(): void {
    
    this.loadInsurance();
    this.loadBranch(this.doctorId)
    
    
   
    
  }
  
 
  loadBranch(idDoctor:number):void{
    this.specialityBranchService.getDoctorBranchesBySpeciality(idDoctor)
    .subscribe(branches => {
    this.branchs = branches;

    
    // Realiza las acciones necesarias con las ramas obtenidas
  });
  }

  

  loadInsurance():void{
    this.insuranceService.getAll().subscribe(data=>{
      this.insurances = data
      
    })
  }

  
  
 
  onSubmit(): void {
    if (this.insuranceDoctorForm.valid) {
      const insuranceDoctor=this.insuranceDoctorForm.value;
      insuranceDoctor.doctor=this.doctorId
      this.insuranceDoctorService.create(insuranceDoctor).subscribe({
        next: (response) => {
              this.dialog.showSuccessDialog("Obra Social agregada correctamente");
              this.router.navigate(['/Dashboard/insurances/doctor/me']);
              const doctor=history.state.doctor
              this.router.navigate(['Dashboard/accounts/doctores/insurance/'], {
                state: {doctor},
              });
              
            },
            error: (error) => {
              
              this.dialog.showErrorDialog(error.error.message);
            }
           
          });
        
    } 
  }
  
  onCancel(): void{
    const doctor=history.state.doctor
    this.router.navigate(['Dashboard/accounts/doctores/insurance/'], {
      state: {doctor},
    });
  }
}
