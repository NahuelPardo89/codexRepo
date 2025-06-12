import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorScheduleInterface } from 'src/app/Models/Profile/doctorschedule.interface';
import { DoctorscheduleService } from 'src/app/Services/Profile/doctorschedule/doctorschedule.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent {
  scheduleForm!: FormGroup;
  days = [
    { display: 'Lunes', value: 'mon' },
    { display: 'Martes', value: 'tue' },
    { display: 'Miércoles', value: 'wed' },
    { display: 'Jueves', value: 'thu' },
    { display: 'Viernes', value: 'fri' },
    { display: 'Sábado', value: 'sat' },
    { display: 'Domingo', value: 'sun' }
  ];
  doctorId!: number;
  doctor!:DoctorProfile;

  constructor(
    private fb: FormBuilder,
    private doctorScheduleService: DoctorscheduleService,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.doctorId = history.state.doctor.id;
    this.doctor = history.state.doctor;
    
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.scheduleForm = this.fb.group({
      day: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const newSchedule: DoctorScheduleInterface = this.scheduleForm.value;
      newSchedule.doctor=this.doctorId;
      
      this.doctorScheduleService.createSchedule(newSchedule).subscribe({
        next: () => {

          this.dialogService.showSuccessDialog("Horario creado con éxito")
          
          this.redirectSchedule() // Ajusta según tus necesidades
        },
        error: error => this.dialogService.showErrorDialog("hubo un error al crear el horario")
      });
    } else {
      console.log('El formulario no es válido');
    }
  }
  onCancel(){
    this.redirectSchedule() // Ajusta se
  }

  redirectSchedule(){
    const doctor=this.doctor;
    this.router.navigate(['Dashboard/accounts/doctores/schedule/'], {
      state: { doctor },
    });
  }
}

