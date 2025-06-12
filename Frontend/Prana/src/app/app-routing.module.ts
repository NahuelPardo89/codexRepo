import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route, Router } from '@angular/router';
import { StaffComponent } from './Modules/home/components/staff/staff.component';
import { ProfessionalsComponent } from './Modules/professionals/professionals/professionals.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { PageNotFoundComponent } from './Modules/shared/components/pagenotfound/pagenotfound.component';
import { SinginComponent } from './Modules/auth/components/singin/singin.component';
import { PasswordResetRequestComponent } from './Modules/auth/components/password-reset-request/password-reset-request.component';
import { LoginComponent } from './Modules/auth/components/login/login.component';

const routes: Route[] = [
 
  { path: '', component: StaffComponent },
  { path: 'profesionales', component: ProfessionalsComponent },
  { path: 'aboutus', component: QuienesSomosComponent },
  {path:'resetpass', component: PasswordResetRequestComponent},

    
  
  {
    path: 'Dashboard',
    loadChildren: () =>
      import('./Modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./Modules/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'singin', component: SinginComponent },
  { path: 'login', component: LoginComponent },
  
  { path: '**', component: PageNotFoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.resetConfig(routes);
  }
}
