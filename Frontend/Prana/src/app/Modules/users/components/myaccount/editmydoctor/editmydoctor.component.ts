import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-editmydoctor',
  templateUrl: './editmydoctor.component.html',
  styleUrls: ['./editmydoctor.component.css'],
})
export class EditmydoctorComponent {
  doctorForm!: FormGroup;
  doctorName!: string;

  durationOptions = [
    { label: '15 min', value: 15 * 60 },
    { label: '30 min', value: 30 * 60 },
    { label: '45 min', value: 45 * 60 },
    { label: '60 min', value: 60 * 60 },
    { label: '75 min', value: 75 * 60 },
    { label: '90 min', value: 90 * 60 },
    { label: '105 min', value: 105 * 60 },
    { label: '120 min', value: 120 * 60 },
    { label: '135 min', value: 135 * 60 },
    { label: '150 min', value: 150 * 60 },
    { label: '165 min', value: 165 * 60 },
    { label: '180 min', value: 180 * 60 },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private doctorService: DoctorprofileService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (history.state.doctor) {
      const durationInSeconds = this.convertTimeToSeconds(
        history.state.doctor.appointment_duration
      );
      this.doctorForm.patchValue({
        ...history.state.doctor,
        appointment_duration: durationInSeconds,
        copayment: history.state.doctor.copayment,
      });

      this.doctorName = history.state.doctor.user;
    }
  }

  private initForm() {
    this.doctorForm = this.fb.group({
      medicLicence: ['', Validators.required],
      appointment_duration: ['', Validators.required],
      // copayment: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      const doctortId = history.state.doctor ? history.state.doctor.id : null;
      if (doctortId) {
        this.doctorService.updateLoggedDoctor(this.doctorForm.value).subscribe({
          next: () => {
            this.dialogService.showSuccessDialog(
              'Profesional Editado con éxito'
            );
            this.router.navigate(['Dashboard/accounts/myaccount']);
          },
          error: (error) => {
            console.log(error);
            this.dialogService.showErrorDialog(
              'Error al actualizar el Profesional'
            );
          },
        });
      } else {
        console.error(
          'Error: No se pudo obtener el ID del usuario para la actualización.'
        );
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      console.log('El formulario no es válido');
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel() {
    this.router.navigate(['Dashboard/accounts/myaccount']);
  }
  private convertTimeToSeconds(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    return hours * 3600 + minutes * 60;
  }
}
