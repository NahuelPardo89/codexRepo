import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { InsuranceDoctorService } from 'src/app/Services/Profile/healthinsurance/insuranceDoctor/insurance-doctor.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
//TODO FILTRAR BRANCH POR ESPECIALIDAD
@Component({
  selector: 'app-create-insurance-doctor',
  templateUrl: './create-insurance-doctor.component.html',
  styleUrls: ['./create-insurance-doctor.component.css']
})
export class CreateInsuranceDoctorComponent {
  doctors: DoctorProfile[]= [];
  insurances: HealthInsurance[]= [];
  branchs:SpecialityBranch[]= [];
  filteredDoctor: Observable<DoctorProfile[]>=new Observable<DoctorProfile[]>();
  insuranceDoctorForm: FormGroup;
  doctorControl = new FormControl('', Validators.required);
  showBranch: boolean = false;
  constructor(
    private doctorProfileService:DoctorprofileService,
    private insuranceService: HealthinsuranceService,
    private insuranceDoctorService: InsuranceDoctorService,
    private specialityBranchService: BranchService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router,
  ) {
    this.insuranceDoctorForm = this.fb.group({
      doctor: this.doctorControl,
      insurance: ['', Validators.required],
      branch: ['',Validators.required ],
      price: ['', Validators.required, Validators.min(1)],

      
      
    });
    
  }
  private doctorChangeSubscription?: Subscription;
  ngOnInit(): void {
    this.loadPatient();
    this.loadInsurance();
    
    this.filterPatient();
    this.doctorChangeSubscription = this.insuranceDoctorForm.get('doctor')?.valueChanges.subscribe(doctor => {
      this.loadBranch(doctor.id);
      this.showBranch=true
    });
    
  }
  ngOnDestroy() {
    // Limpiar la suscripción al observador
    if (this.doctorChangeSubscription) {
      this.doctorChangeSubscription.unsubscribe();
    }
  }

  loadPatient():void{
    this.doctorProfileService.getDoctors().subscribe(data=>{
      
      this.doctors = data
      

    })
  }
  loadBranch(idDoctor:number=0):void{
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

  filterPatient(){
    this.filteredDoctor = this.insuranceDoctorForm.get('doctor')!.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : ''),
        map(name => name ? this._filterDoctor(name) : this.doctors.slice())
      );
  }
  
  private _filterDoctor(value: string): DoctorProfile[] {
    return this.doctors.filter(doctor =>
      doctor.user.toString().toLowerCase().includes(value)
    );
  }
  displayDoctor(doctor: DoctorProfile): string {
    return doctor && doctor.user ? doctor.user.toString() : '';
  }
  onSubmit(): void {
    if (this.insuranceDoctorForm.valid) {
      const doctorid =this.insuranceDoctorForm.value.doctor.id
      this.insuranceDoctorForm.value.doctor=doctorid;
   
      this.insuranceDoctorService.create(this.insuranceDoctorForm.value).subscribe({
        next: (response) => {
              this.dialog.showSuccessDialog("Obra Social agregada correctamente");
              this.router.navigate(['/Dashboard/insurances/doctor']);
              
            },
            error: (error) => {
            
              this.dialog.showErrorDialog(error.error.message);
            }
           
          });
        
    } 
  }
  
  onCancel(): void{
    this.router.navigate(['/Dashboard/insurances/doctor']);
  }
}
