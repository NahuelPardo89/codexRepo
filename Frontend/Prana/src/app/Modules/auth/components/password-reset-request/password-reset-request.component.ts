import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.css'],
})
export class PasswordResetRequestComponent {
  resetPassForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.resetPassForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.authService
      .requestPasswordReset(this.resetPassForm.value.email)
      .subscribe({
        next: (response) => {
          this.dialogService.showSuccessDialog(
            'Se envió un correo electrónico a su cuenta para restablecer la contraseña'
          );
          this.router.navigate(['login']);
        },
        error: (error) => {
          // Aquí puedes manejar el error, mostrando un mensaje al usuario
          this.dialogService.showErrorDialog(
            'Hubo un error al enviar el correo o el correo ingresado no existe en nuestro sistema'
          );
          
        },
      });
  }
}
