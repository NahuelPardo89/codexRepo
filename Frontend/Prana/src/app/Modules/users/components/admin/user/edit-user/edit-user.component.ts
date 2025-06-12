import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (history.state.user) {
      this.userForm.patchValue(history.state.user);
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      dni: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      is_active: [true],
      is_staff: [false],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Obtén el ID del usuario que se está editando
      const userId = history.state.user ? history.state.user.id : null;
      if (userId) {
        const nameInUpperCase = this.userForm.get('name')?.value.toUpperCase();
        const lastNameInUpperCase = this.userForm.get('last_name')?.value.toUpperCase();
        this.userForm.get('name')?.setValue(nameInUpperCase);
        this.userForm.get('last_name')?.setValue(lastNameInUpperCase);
        this.userService.updateUser(userId, this.userForm.value).subscribe({
          next: (response) => {
            console.log('Usuario actualizado con éxito');
            this.dialogService.showSuccessDialog('Usuario Editado con éxito');
            this.router.navigate(['Dashboard/accounts/users']); // Ajusta la ruta según sea necesario
          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
          
            // Aquí manejas el error basado en el mensaje específico
            if (error.error.message.includes("DNI")) {
              //this.dialog.showErrorDialog("Ya existe un usuario con ese DNI.");
              this.dialogService.showErrorDialog("Ya existe otro usuario con ese dni");
            } else if (error.error.message.includes("email")) {
              //this.dialog.showErrorDialog("Ya existe un usuario con ese email.");
              this.dialogService.showErrorDialog("Ya existe otro usuario con ese email");
            } else {
              // Para otros tipos de errores no esperados
              this.dialogService.showErrorDialog("Error al editar el usuario.");
            }
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
    this.router.navigate(['Dashboard/accounts/users']);
  }
}
