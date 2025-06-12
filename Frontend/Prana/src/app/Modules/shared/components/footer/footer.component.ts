import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewletterService } from 'src/app/Services/newletter/newletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  newsletterForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private newsletterService: NewletterService) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.newsletterForm.get('email');
  }

  onSubmit() {
    if (this.newsletterForm.valid) {
      this.newsletterService.subscribe(this.newsletterForm.value.email).subscribe(
        response => {
          console.log('Email registrado:', response);
          this.successMessage = 'Subscripción realizada con éxito';
          this.errorMessage = '';
          this.newsletterForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error al registrar el email:', error);
          if (error.status === 400 && error.error?.email?.[0] === 'Ya existe un/a newletter con este/a Correo Electrónico.') {
            this.errorMessage = 'El Email ingresado ya se encuentra registrado';
          } else {
            this.errorMessage = 'Ocurrió un error al registrar el email. Inténtalo de nuevo más tarde.';
          }
          this.successMessage = '';
        }
      );
    }
  }
}
