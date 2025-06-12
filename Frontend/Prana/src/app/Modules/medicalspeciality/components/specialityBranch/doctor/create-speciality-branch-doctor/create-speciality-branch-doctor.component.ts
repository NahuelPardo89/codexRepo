import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-create-speciality-branch-doctor',
  templateUrl: './create-speciality-branch-doctor.component.html',
  styleUrls: ['./create-speciality-branch-doctor.component.css']
})
export class CreateSpecialityBranchDoctorComponent {
  specialties!: Medicalspeciality

  branchForm: FormGroup;

  constructor(
    private branchService: BranchService,
    private specialtyService: SpecialityService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router
  ) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      
    });
  }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.specialtyService.getMeSpecialities().subscribe((data) => {
      this.specialties = data;
      
    });
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      const nameInUpperCase = this.branchForm.get('name')?.value.toUpperCase();

      // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.branchForm.get('name')?.setValue(nameInUpperCase);
      const branch: SpecialityBranch= this.branchForm.value
      branch.speciality = this.specialties.id
      this.branchService
        .createSpecialityBranch(branch)
        .subscribe({
          next: (response) => {
            this.dialog.showSuccessDialog(
              'Rama de Especialidad creada correctamente'
            );
            this.router.navigate(['/Dashboard/speciality/branch/me/']);
          },
          error: (error) => {
           
            this.dialog.showErrorDialog(
              error.error.message
            );
          },
        });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/speciality/branch/me/']);
  }
}
