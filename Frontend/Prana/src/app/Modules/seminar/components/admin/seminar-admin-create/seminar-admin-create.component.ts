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

/**
 * Component for creating a new seminar.
 *
 * @component
 * @class
 * @export
 * @author Alvaro Olguin Armendariz
 */
@Component({
  selector: 'app-seminar-admin-create',
  templateUrl: './seminar-admin-create.component.html',
  styleUrls: ['./seminar-admin-create.component.css'],
})
export class SeminarAdminCreateComponent {
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

  /**
   * Constructs the SeminarAdminCreateComponent.
   *
   * @constructor
   * @param {FormBuilder} fb - The Angular FormBuilder service for creating form groups.
   * @param {SeminaristService} seminaristService - The service for managing seminarists' profiles.
   * @param {RoomService} roomService - The service for managing rooms.
   * @param {ScheduleService} scheduleService - The service for managing schedules.
   * @param {DialogService} dialogService - The service for displaying dialogs.
   * @param {SeminarService} seminarService - The service for managing seminars.
   * @param {Router} router - The Angular Router service for navigation.
   */
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

  /**
   * Lifecycle hook called after component initialization.
   *
   * @method
   */
  ngOnInit(): void {
    this.loadRooms();
    this.loadSeminarists();
    this.loadSchedules();
  }

  /***** INIT DATA SECTION *****/

  /**
   * Loads the list of rooms.
   */
  loadRooms(): void {
    this.roomService.getRooms().subscribe((data) => {
      //sort
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.rooms = data;
    });
  }

  /**
   * Loads the list of seminarists.
   */
  loadSeminarists(): void {
    this.seminaristService.getSeminaristsDisplay().subscribe((data) => {
      //Filter and sort
      let activeSeminarists = data.filter((seminarist) => seminarist.is_active);
      activeSeminarists.sort((a, b) => a.user.localeCompare(b.user));
      this.seminarians = activeSeminarists;
    });
  }

  /**
   * Loads the list of schedules.
   */
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

  /**
   * Handles the form submission for creating a new seminar.
   *
   * @method
   */
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
        'Confirma la creación del taller'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.seminarService
            .createSeminar(filteredBody)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al crear el taller: ' + errorMessage
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
                'Taller creado exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const createAnotherAppointment =
                  this.dialogService.openConfirmDialog(
                    '¿Desea crear otro taller?'
                  );
                createAnotherAppointment
                  .afterClosed()
                  .subscribe((confirmResult) => {
                    if (confirmResult) {
                      // reset form or reload?
                      window.location.reload();
                    } else {
                      // Redirect to apointment list
                      this.router.navigate(['/Dashboard/seminar/admin/list']);
                    }
                  });
              });
            });
        }
      });
    }
  }

  /**
   * Handles the cancellation of seminar creation.
   *
   * @method
   */
  onCancel() {
    this.router.navigate(['/Dashboard/seminar/admin/list']);
  }
}
