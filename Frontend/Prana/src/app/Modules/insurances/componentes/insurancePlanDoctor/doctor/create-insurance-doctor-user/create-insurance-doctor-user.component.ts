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
  selector: 'app-create-insurance-doctor-user',
  templateUrl: './create-insurance-doctor-user.component.html',
  styleUrls: ['./create-insurance-doctor-user.component.css'],
})
export class CreateInsuranceDoctorUserComponent {
  insurances: HealthInsurance[] = [];
  branchs: SpecialityBranch[] = [];

  insuranceDoctorForm: FormGroup;

  showBranch: boolean = false;
  constructor(
    private insuranceService: HealthinsuranceService,
    private insuranceDoctorService: InsuranceDoctorService,
    private specialityBranchService: BranchService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router
  ) {
    this.insuranceDoctorForm = this.fb.group({
      insurance: ['', Validators.required],
      branch: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadInsurance();
    this.loadBranch();
  }

  loadBranch(idDoctor: number = 0): void {
    this.specialityBranchService
      .getMeSpecialityBranches()
      .subscribe((branches) => {
        this.branchs = branches;

        // Realiza las acciones necesarias con las ramas obtenidas
      });
  }

  loadInsurance(): void {
    this.insuranceService.getAll().subscribe((data) => {
      this.insurances = data;
    });
  }

  onSubmit(): void {
    if (this.insuranceDoctorForm.valid) {
      this.insuranceDoctorService
        .createMeDoctorInsurance(this.insuranceDoctorForm.value)
        .subscribe({
          next: (response) => {
            this.dialog.showSuccessDialog('Obra Social agregada correctamente');
            this.router.navigate(['/Dashboard/insurances/doctor/me']);
          },
          error: (error) => {
            this.dialog.showErrorDialog(error.error.message);
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/Dashboard/insurances/doctor/me']);
  }
}
