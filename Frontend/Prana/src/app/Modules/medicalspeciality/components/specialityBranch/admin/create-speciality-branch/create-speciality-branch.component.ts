import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-create-speciality-branch',
  templateUrl: './create-speciality-branch.component.html',
  styleUrls: ['./create-speciality-branch.component.css'],
})
export class CreateSpecialityBranchComponent {
  specialties: Medicalspeciality[] = [];

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
      speciality: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.specialtyService.getSpecialities().subscribe((data) => {
      const spec = data.filter((specialty) => specialty.is_active);
      this.specialties = spec;
      //this.specialties = data;
    });
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      const nameInUpperCase = this.branchForm.get('name')?.value.toUpperCase();

      // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.branchForm.get('name')?.setValue(nameInUpperCase);
      this.branchService
        .createSpecialityBranch(this.branchForm.value)
        .subscribe({
          next: (response) => {
            this.dialog.showSuccessDialog(
              'Rama de Especialidad creada correctamente'
            );
            this.router.navigate(['/Dashboard/speciality/branch']);
          },
          error: (error) => {
            this.dialog.showErrorDialog(error.error.message);
          },
        });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/speciality/branch']);
  }
}
