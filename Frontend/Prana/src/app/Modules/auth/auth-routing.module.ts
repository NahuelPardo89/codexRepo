import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SinginComponent } from './components/singin/singin.component';
import { PasswordResetRequestComponent } from './components/password-reset-request/password-reset-request.component';

const routes: Routes = [
  {path:'resetpass', component: PasswordResetRequestComponent},
  {
    path:'login', component: LoginComponent
  },
  {
    path:'singin', component: SinginComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
