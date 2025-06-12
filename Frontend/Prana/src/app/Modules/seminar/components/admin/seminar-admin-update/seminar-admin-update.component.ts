import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { SeminaristProfileDisplayInterface } from 'src/app/Models/Profile/seminaristProfile.interface';
import { RoomAdminInterface } from 'src/app/Models/room/admin/roomAdminInterface.interface';
import { ScheduleAdminInterface } from 'src/app/Models/schedule/scheduleAdminInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { SeminaristService } from 'src/app/Services/Profile/seminarist/seminarist.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { RoomService } from 'src/app/Services/room/room.service';
import { ScheduleService } from 'src/app/Services/schedule/schedule.service';
import { SeminarService } from 'src/app/Services/seminar/seminar.service';

@Component({
  selector: 'app-seminar-admin-update',
  templateUrl: './seminar-admin-update.component.html',
  styleUrls: ['./seminar-admin-update.component.css'],
})
export class SeminarAdminUpdateComponent {
  // Form
  seminarForm: FormGroup;
  // Response data
  seminarResponse: SeminarAdminInterface;
  // Data
  schedules: ScheduleAdminInterface[] = [];
  seminarians: SeminaristProfileDisplayInterface[] = [];
  rooms: RoomAdminInterface[] = [];
  monthChoices = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private fb: FormBuilder,
    private seminaristService: SeminaristService,
    private roomService: RoomService,
    private scheduleService: ScheduleService,
    private dialogService: DialogService,
    private seminarService: SeminarService,
    private router: Router
  ) {
    this.seminarForm = this.fb.group({
      name: [null, Validators.required],
      month: [null, Validators.required],
      year: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(2024),
        ],
      ],
      schedule: [null, Validators.required],
      meetingNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(1),
          Validators.max(30),
        ],
      ],
      maxInscription: [
        null,
        [Validators.pattern(/^[0-9]\d*$/), Validators.min(1)],
      ],
      price: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(0),
        ],
      ],
      is_active: [null],
      seminarist: [null, Validators.required],
      room: [null, Validators.required],
    });
    this.seminarResponse = {
      id: 0,
      name: '',
      month: '',
      year: 0,
      schedule: [],
      meetingNumber: 0,
      maxInscription: 0,
      price: 0,
      is_active: false,
      seminarist: [],
      patients: [],
      rooms: [],
    };
  }

  ngOnInit(): void {
    this.loadRooms();
    this.loadSeminarists();
    this.loadSchedules();
    this.initForm(history.state.seminar);
  }

  /***** INIT DATA SECTION *****/

  initForm(seminar: SeminarAdminInterface): void {
    if (seminar.id) {
      this.seminarService.getSeminarById(seminar.id).subscribe((data) => {
        this.seminarForm.patchValue({
          name: data.name,
          month: data.month,
          year: data.year,
          schedule: data.schedule,
          meetingNumber: data.meetingNumber,
          maxInscription: data.maxInscription,
          price: data.price,
          is_active: data.is_active,
          seminarist: data.seminarist,
          room: data.rooms,
        });
      });
    }
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((data) => {
      //sort
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.rooms = data;
    });
  }

  loadSeminarists(): void {
    this.seminaristService.getSeminaristsDisplay().subscribe((data) => {
      //Filter and sort
      let activeSeminarists = data.filter((seminarist) => seminarist.is_active);
      activeSeminarists.sort((a, b) => a.user.localeCompare(b.user));
      this.seminarians = activeSeminarists;
    });
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe((data) => {
      // Order the schedules by weekday using a const and a index
      this.schedules = data.sort((a, b) => {
        const days = [
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
          'Domingo',
        ];
        const dayDiff = days.indexOf(a.weekday) - days.indexOf(b.weekday);
        if (dayDiff !== 0) return dayDiff;
        // If is the same day, order by starting hour
        return a.start_hour.localeCompare(b.start_hour);
      });
    });
  }

  onSubmit() {
    if (this.seminarForm.valid) {
      const formValues = this.seminarForm.value;

      const filteredBody = {
        name: formValues.name,
        month: formValues.month,
        year: formValues.year,
        schedule: formValues.schedule,
        meetingNumber: formValues.meetingNumber,
        maxInscription: formValues.maxInscription,
        price: formValues.price,
        seminarist: formValues.seminarist,
        rooms: formValues.room,
        is_active: true,
        patients: [],
      };

      //console.log('BODY: ', filteredBody);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Confirma la actualización del taller'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.seminarService
            .updateSeminar(history.state.seminar.id, filteredBody)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al actualizar el taller: ' + errorMessage
                  );
                } else {
                  // Show a general error
                  this.dialogService.showErrorDialog(
                    'Ha ocurrido un error en la solicitud.'
                  );
                }

                throw error;
              })
            )
            .subscribe((data: SeminarAdminInterface) => {
              this.seminarResponse = data;
              const successDialog = this.dialogService.showSuccessDialog(
                'Taller actualizado exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                this.router.navigate(['/Dashboard/seminar/admin/list']);
              });
            });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/Dashboard/seminar/admin/list']);
  }
}
