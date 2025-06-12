import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtResponse } from 'src/app/Models/user/jwtResponse.interface';
import { LoginUser } from 'src/app/Models/user/loginUser.interface';
import { AuthService } from 'src/app/Services/auth/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy{
  loginForm!: FormGroup;
  public errorMessage: string = '';
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
      
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const user: LoginUser = this.loginForm.value;


  
      this.authService.login(user)

    }
  }
  
}
