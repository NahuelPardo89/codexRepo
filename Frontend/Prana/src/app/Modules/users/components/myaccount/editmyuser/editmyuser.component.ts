import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';
@Component({
  selector: 'app-editmyuser',
  templateUrl: './editmyuser.component.html',
  styleUrls: ['./editmyuser.component.css']
})
export class EditmyuserComponent {

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
        this.userService.updateLoggedUser(this.userForm.value).subscribe({
          next: () => {
            
            this.dialogService.showSuccessDialog('Usuario Editado con éxito');

            this.router.navigate(['Dashboard/accounts/myaccount']); // Ajusta la ruta según sea necesario
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
            this.dialogService.showErrorDialog(
              'Error al actualizar el usuario'
            );
            // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
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
}
