import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUser } from 'src/app/Models/user/registerUser.interface';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css']
})
export class SinginComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService, private dialogService: DialogService) {
    
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      dni: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(999000000),Validators.minLength(7)]],
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9+\-ñ ]*$"),]],
      last_name: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9+\-ñ ]*$")]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._+-ñ]+@[a-zA-Z0-9_.-]+\.[a-zA-Z]{2,4}$')]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(8)]]
      
    });
  }
  get dni() {
    return this.registerForm.get('dni');
  }

  get name() {
    return this.registerForm.get('name');
  }

  get last_name() {
    return this.registerForm.get('last_name');
  }

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }


  onSubmit() {
    if (this.registerForm.valid) {
      const userData: RegisterUser = this.registerForm.value;
  
      this.authService.register(userData).subscribe({
        next: (response) => {
          this.authService.handleLogin(response.body!);
          this.dialogService.showSuccessDialog("Cuenta creada con éxito!. Bienvenido/a")
          
          this.router.navigate(['/Dashboard/accounts/myaccount']);
        },
        error: (error) => {
          
          if (error.error.message.includes("DNI")) {
            // Manejar error específico de DN
            
            this.registerForm.controls['dni'].setErrors({ 'dniExists': true });
          }
          if (error.error.message.includes("email")) {
            // Manejar error específico de email
            
            this.registerForm.controls['email'].setErrors({ 'emailExists': true });
          }
        }
      });
    }
  }
}
