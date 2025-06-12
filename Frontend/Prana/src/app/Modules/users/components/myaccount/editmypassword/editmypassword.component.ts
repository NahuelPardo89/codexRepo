import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-editmypassword',
  templateUrl: './editmypassword.component.html',
  styleUrls: ['./editmypassword.component.css']
})
export class EditmypasswordComponent {
  passwordForm!: FormGroup;
  constructor(private userService: UserService,private fb: FormBuilder,private dialogService: DialogService,private router:Router) {
    
  }

  ngOnInit(): void {
    this.initForm();
    
  }

  private initForm() {
    this.passwordForm = this.fb.group({
      passwordOld: ['', [Validators.required,Validators.minLength(8)]],
      passwordNew: ['', [Validators.required,Validators.minLength(8)]],
      passwordNewRepeat: ['', [Validators.required,Validators.minLength(8)]]
    }, {
      validators: this.mustMatch('passwordNew', 'passwordNewRepeat')
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
  onSubmit(): void {
    if (this.passwordForm.valid) {
      // Obtén el ID del usuario que se está editando
        const passwordOld= this.passwordForm.get('passwordOld')?.value;
        const passwordNew= this.passwordForm.get('passwordNew')?.value;
        
        this.userService.changePassword(passwordOld,passwordNew).subscribe({
          next: () => {
            
            this.dialogService.showSuccessDialog('Contraseña Editada con éxito');

            this.router.navigate(['Dashboard/accounts/myaccount']); // Ajusta la ruta según sea necesario
          },
          error: (error) => {
            
            this.dialogService.showErrorDialog(
              'La contraseña actual no es correcta'
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
    
  }
  onCancel() {
    this.router.navigate(['Dashboard/accounts/myaccount']);
  }
}
