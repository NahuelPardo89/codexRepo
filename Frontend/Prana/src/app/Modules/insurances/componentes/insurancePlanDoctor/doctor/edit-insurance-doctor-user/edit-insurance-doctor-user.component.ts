import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceDoctorService } from 'src/app/Services/Profile/healthinsurance/insuranceDoctor/insurance-doctor.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-insurance-doctor-user',
  templateUrl: './edit-insurance-doctor-user.component.html',
  styleUrls: ['./edit-insurance-doctor-user.component.css'],
})
export class EditInsuranceDoctorUserComponent {
  insuranceDoctorForm!: FormGroup;
  doctorName!: string;
  insuranceName!: string;
  branchName!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceDoctorService: InsuranceDoctorService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (history.state.insurancePlanDoctor) {
      this.doctorName = history.state.insurancePlanDoctor.doctor;
      this.insuranceName = history.state.insurancePlanDoctor.insurance;
      this.branchName = history.state.insurancePlanDoctor.branch;
      this.insuranceDoctorForm.patchValue(history.state.insurancePlanDoctor);
    }
  }

  private initForm() {
    this.insuranceDoctorForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.insuranceDoctorForm.valid) {
      const insuranceDoctorId = history.state.insurancePlanDoctor
        ? history.state.insurancePlanDoctor.id
        : null;
      if (insuranceDoctorId) {
        this.insuranceDoctorService
          .updateMeDoctorInsurance(
            insuranceDoctorId,
            this.insuranceDoctorForm.value
          )
          .subscribe({
            next: () => {
              this.dialogService.showSuccessDialog(
                'Obra Social Editada con éxito'
              );
              this.router.navigate(['/Dashboard/insurances/doctor/me']);
            },
            error: (error) => {
              this.dialogService.showErrorDialog(
                'Error al actualizar la Obra Social'
              );
            },
          });
      } else {
        this.dialogService.showErrorDialog(
          'Error: No se pudo obtener el ID del usuario para la actualización.'
        );
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/insurances/doctor/me']);
  }
}
