import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { InsurancePatientService } from 'src/app/Services/Profile/healthinsurance/insurancePatient/insurance-patient.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-create-insurance-patient',
  templateUrl: './create-insurance-patient.component.html',
  styleUrls: ['./create-insurance-patient.component.css']
})
export class CreateInsurancePatientComponent implements OnInit {
  patients: Patient[]= [];
  insurances: HealthInsurance[]= [];
  filteredPatient: Observable<Patient[]>=new Observable<Patient[]>();
  insurancePatientForm: FormGroup;
  patientControl = new FormControl('', Validators.required);
  constructor(
    private patientProfileService:PatientService,
    private insuranceService: HealthinsuranceService,
    private insurancePatientService: InsurancePatientService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router,
  ) {
    this.insurancePatientForm = this.fb.group({
      patient: this.patientControl,
      insurance: ['', Validators.required],
      code: ['', ],
      
      
    });
    
  }
  ngOnInit(): void {
    this.loadPatient();
    this.loadInsurance();
    this.filterPatient()
  }

  loadPatient():void{
    this.patientProfileService.getAllPatients().subscribe(data=>{
     
      this.patients = data

    })
  }

  loadInsurance():void{
    this.insuranceService.getAll().subscribe(data=>{
      this.insurances = data
      
    })
  }

  filterPatient(){
    this.filteredPatient = this.insurancePatientForm.get('patient')!.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : ''),
        map(name => name ? this._filterPatient(name) : this.patients.slice())
      );
  }
  
  private _filterPatient(value: string): Patient[] {
    return this.patients.filter(patient =>
      patient.user.toString().toLowerCase().includes(value)
    );
  }
  displayPatient(patient: Patient): string {
    return patient && patient.user ? patient.user.toString() : '';
  }
  onSubmit(): void {
    if (this.insurancePatientForm.valid) {
      const patientid =this.insurancePatientForm.value.patient.id
      this.insurancePatientForm.value.patient=patientid;
      console.log(this.insurancePatientForm.value)
      this.insurancePatientService.create(this.insurancePatientForm.value).subscribe({
        next: (response) => {
              this.dialog.showSuccessDialog("Obra Social agregada correctamente");
              this.router.navigate(['/Dashboard/insurances/patient']);
              
            },
            error: (error) => {
             
              this.dialog.showErrorDialog(error.error.message);
            }
           
          });
        
    } 
  }
  
  onCancel(): void{
    this.router.navigate(['/Dashboard/insurances/patient']);
  }
}
