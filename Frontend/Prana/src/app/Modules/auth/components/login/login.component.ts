import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtResponse } from 'src/app/Models/user/jwtResponse.interface';
import { LoginUser } from 'src/app/Models/user/loginUser.interface';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy{
  loginForm!: FormGroup;
  public errorMessage: string = '';
  private loginSub?: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      dni: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(999000000)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const user: LoginUser = this.loginForm.value;

      this.errorMessage = '';
      this.loginSub = this.authService.login(user).subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Usuario o Contrase\u00f1a incorrectos';
        }
      });

    }
  }
  
}
