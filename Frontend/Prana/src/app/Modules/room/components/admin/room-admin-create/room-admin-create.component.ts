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
import { RoomService } from 'src/app/Services/room/room.service';
import { RoomAdminInterface } from 'src/app/Models/room/admin/roomAdminInterface.interface';

@Component({
  selector: 'app-room-admin-create',
  templateUrl: './room-admin-create.component.html',
  styleUrls: ['./room-admin-create.component.css'],
})

/**
 * Component for creating rooms in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
export class RoomAdminCreateComponent {
  roomForm: FormGroup;
  /**
   * Initializes the component by setting up the form.
   * @param {FormBuilder} fb - The form builder.
   * @param {DialogService} dialogService - The dialog service.
   * @param {RoomService} roomService - The room service.
   * @param {Router} router - The router.
   * @author Alvaro Olguin Armendariz
   */
  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private roomService: RoomService,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [
        null,
        [
          Validators.required,
          this.integerValidator,
          this.positiveIntegerValidator,
        ],
      ],
      cost: [
        null,
        [
          Validators.required,
          this.integerValidator,
          this.positiveIntegerValidator,
        ],
      ],
    });
  }

  /***** Custom validators *****/

  /**
   * Custom validator for checking if a value is an integer.
   * @param {FormControl} control - The form control to validate.
   * @returns {Object|null} Validation error object or null if valid.
   * @author Alvaro Olguin Armendariz
   */
  integerValidator(control: FormControl): object | null {
    const isInteger = Number.isInteger(Number(control.value));
    return isInteger ? null : { notInteger: true };
  }

  /**
   * Custom validator for checking if a value is a float.
   * @param {FormControl} control - The form control to validate.
   * @returns {Object|null} Validation error object or null if valid.
   * @author Alvaro Olguin Armendariz
   */
  floatValidator(control: FormControl): object | null {
    const isFloat = Number(control.value) === parseFloat(control.value);
    return isFloat ? null : { notFloat: true };
  }

  /**
   * Custom validator for checking if a value is a positive integer.
   * @param {FormControl} control - The form control to validate.
   * @returns {Object|null} Validation error object or null if valid.
   * @author Alvaro Olguin Armendariz
   */
  positiveIntegerValidator(control: FormControl): object | null {
    const isInteger = Number.isInteger(Number(control.value));
    const isPositive = Number(control.value) > 0;
    return isInteger && isPositive ? null : { notPositiveInteger: true };
  }

  /**
   * Custom validator for checking if a value is a positive float.
   * @param {FormControl} control - The form control to validate.
   * @returns {Object|null} Validation error object or null if valid.
   * @author Alvaro Olguin Armendariz
   */
  positiveFloatValidator(control: FormControl): object | null {
    const isFloat = Number(control.value) === parseFloat(control.value);
    const isPositive = Number(control.value) > 0;
    return isFloat && isPositive ? null : { notPositiveFloat: true };
  }

  /**
   * Handles form submission. If the form is valid, it opens a confirmation dialog.
   * If the creation is confirmed, it sends a request to create the room.
   * @author Alvaro Olguin Armendariz
   */
  onSubmit(): void {
    if (this.roomForm.valid) {
      //const formValues = this.roomForm.value;
      const body = {
        name: this.roomForm.value.name,
        capacity: this.roomForm.value.capacity,
        cost: this.roomForm.value.cost,
      };

      //console.log('BODY: ', body);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Desea confirmar la creación de la sala?'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.roomService
            .createAdminRoom(body)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al crear la sala: ' + errorMessage
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
            .subscribe((data: RoomAdminInterface) => {
              const successDialog = this.dialogService.showSuccessDialog(
                'Sala creada exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const createAnotherAppointment =
                  this.dialogService.openConfirmDialog(
                    '¿Desea crear otra sala?'
                  );
                createAnotherAppointment
                  .afterClosed()
                  .subscribe((confirmResult) => {
                    if (confirmResult) {
                      window.location.reload();
                    } else {
                      // Redirect to rooms list
                      this.router.navigate(['/Dashboard/room/admin/list']);
                    }
                  });
              });
            });
        }
      });
    }
  }

  /**
   * Handles the cancel event by navigating back to the room list.
   * @author Alvaro Olguin Armendariz
   */
  onCancel() {
    this.router.navigate(['/Dashboard/room/admin/list']);
  }
}
