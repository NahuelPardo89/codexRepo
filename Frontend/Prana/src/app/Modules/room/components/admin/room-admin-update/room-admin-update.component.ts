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
  selector: 'app-room-admin-update',
  templateUrl: './room-admin-update.component.html',
  styleUrls: ['./room-admin-update.component.css'],
})

/**
 * Component for updating rooms in the admin interface.
 * @author Alvaro Olguin Armendariz
 */
export class RoomAdminUpdateComponent {
  roomForm: FormGroup;
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

  /**
   * Initializes the component by setting up the form with the room data.
   * @author Alvaro Olguin Armendariz
   */
  ngOnInit(): void {
    this.initForm(history.state.room);
  }

  /**
   * Initializes the form with the provided room data.
   * @param {RoomAdminInterface} room - The room data to initialize the form with.
   * @author Alvaro Olguin Armendariz
   */
  initForm(room: RoomAdminInterface): void {
    this.roomForm.patchValue({
      name: room.name,
      capacity: room.capacity,
      cost: room.cost,
    });
  }

  /*****  Custom validators *****/

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
   * If the update is confirmed, it sends a request to update the room and navigates back to the room list.
   * @author Alvaro Olguin Armendariz
   */
  onSubmit(): void {
    if (this.roomForm.valid) {
      const body = {
        name: this.roomForm.value.name,
        capacity: this.roomForm.value.capacity,
        cost: this.roomForm.value.cost,
      };

      //console.log('BODY: ', body);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Tenga en cuenta que al actualizar una sala, los cambios se reflejarán en todos los talleres donde se utilice dicha sala <br> ¿Confirma la actualización de la sala?'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.roomService
            .updateAdminRoom(history.state.room.id, body)
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
                'Sala actualizada exitosamente'
              );
              successDialog.afterClosed().subscribe(() => {
                this.router.navigate(['/Dashboard/room/admin/list']);
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
