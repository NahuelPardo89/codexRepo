import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { catchError } from 'rxjs/operators';
import { ScheduleService } from 'src/app/Services/schedule/schedule.service';
import { ScheduleAdminInterface } from 'src/app/Models/schedule/scheduleAdminInterface.interface';

/**
 * Component for updating seminar schedules in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
@Component({
  selector: 'app-schedule-admin-update',
  templateUrl: './schedule-admin-update.component.html',
  styleUrls: ['./schedule-admin-update.component.css'],
})
export class ScheduleAdminUpdateComponent {
  scheduleForm: FormGroup;
  weekdayOptions = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  /**
   * Initializes the component by setting up the form.
   * @param {FormBuilder} fb - The form builder.
   * @param {DialogService} dialogService - The dialog service.
   * @param {ScheduleService} scheduleService - The schedule service.
   * @param {Router} router - The router.
   * @author Alvaro Olguin Armendariz
   */
  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.scheduleForm = this.fb.group({
      weekday: ['', Validators.required],
      start_hour: [null, [Validators.required, this.timeValidator]],
      end_hour: [null, [Validators.required, this.timeValidator]],
    });
  }

  /**
   * Initializes the component by setting up the form with the schedule data.
   * @author Alvaro Olguin Armendariz
   */
  ngOnInit(): void {
    this.initForm(history.state.schedule);
  }

  /**
   * Initializes the form with the provided schedule data.
   * @param {ScheduleAdminInterface} schedule - The schedule data to initialize the form with.
   * @author Alvaro Olguin Armendariz
   */
  initForm(schedule: ScheduleAdminInterface): void {
    this.scheduleForm.patchValue({
      weekday: schedule.weekday,
      start_hour: schedule.start_hour,
      end_hour: schedule.end_hour,
    });
  }

  /***** Custom validators *****/

  /**
   * Custom validator for checking if a value is a valid time.
   * @param {FormControl} control - The form control to validate.
   * @returns {Object|null} Validation error object or null if valid.
   * @author Alvaro Olguin Armendariz
   */
  timeValidator(control: FormControl): object | null {
    const validTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const isValidTime = validTimePattern.test(control.value);
    return isValidTime ? null : { invalidTime: true };
  }

  /**
   * Handles form submission. If the form is valid, it opens a confirmation dialog.
   * If the update is confirmed, it sends a request to update the schedule and navigates back to the schedule list.
   * @author Alvaro Olguin Armendariz
   */
  onSubmit(): void {
    if (this.scheduleForm.valid) {
      //const formValues = this.roomForm.value;
      const body = {
        weekday: this.scheduleForm.value.weekday,
        start_hour: this.scheduleForm.value.start_hour,
        end_hour: this.scheduleForm.value.end_hour,
      };

      //console.log('BODY: ', body);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Tenga en cuenta que al actualizar un horario, los cambios se reflejarán en todos los talleres donde se utilice dicha horario <br> ¿Confirma la actualización?'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.scheduleService
            .updateAdminSchedule(history.state.schedule.id, body)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al actualizar el horario: ' + errorMessage
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
            .subscribe((data: ScheduleAdminInterface) => {
              const successDialog = this.dialogService.showSuccessDialog(
                'Horario actualizado exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                this.router.navigate(['/Dashboard/schedule/admin/list']);
              });
            });
        }
      });
    }
  }

  /**
   * Handles the cancel event by navigating back to the schedules list.
   * @author Alvaro Olguin Armendariz
   */
  onCancel() {
    this.router.navigate(['/Dashboard/schedule/admin/list']);
  }
}
