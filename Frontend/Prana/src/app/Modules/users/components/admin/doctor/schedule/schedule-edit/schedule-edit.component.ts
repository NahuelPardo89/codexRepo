import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorscheduleService } from 'src/app/Services/Profile/doctorschedule/doctorschedule.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent {
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
  
  doctor!:DoctorProfile;
  

  constructor(
    private fb: FormBuilder,
    private doctorScheduleService: DoctorscheduleService,
    private router: Router,
    private dialogService: DialogService
  ) {
    
    this.doctor = history.state.doctor;
    
    
  }
  convertDayToEnglish(day: string): string {
    const dayConversions: { [key: string]: string } = {
      'Lunes': 'mon',
      'Martes': 'tue',
      'Miércoles': 'wed',
      'Jueves': 'thu',
      'Viernes': 'fri',
      'Sábado': 'sat',
      'Domingo': 'sun',
    };
    return dayConversions[day] || day;
  }

  ngOnInit(): void {
    this.initForm();
    if (history.state.schedule) {
      const scheduleData = {
        ...history.state.schedule,
        day: this.convertDayToEnglish(history.state.schedule.day)
      };
  
      this.scheduleForm.patchValue(scheduleData);
    }
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
      const scheduleId=history.state.schedule.id;
      
      this.doctorScheduleService.updateSchedule(scheduleId,this.scheduleForm.value).subscribe({
        next: () => {
          this.dialogService.showSuccessDialog("Horario actualizado con éxito")
          this.redirectSchedule() // Ajusta según tus necesidades
        },
        error: error => this.dialogService.showErrorDialog("hubo un error al editar el horario")
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
