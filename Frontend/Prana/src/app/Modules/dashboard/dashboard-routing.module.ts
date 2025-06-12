import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'insurances',
        loadChildren: () =>
          import('src/app/Modules/insurances/insurances.module').then(
            (m) => m.InsurancesModule
          ),
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('src/app/Modules/appointments/appointments.module').then(
            (m) => m.AppointmentsModule
          ),
      },
      {
        path: 'appointments_doctor',
        loadChildren: () =>
          import('src/app/Modules/appointments/appointments.module').then(
            (m) => m.AppointmentsModule
          ),
      },
      {
        path: 'speciality',
        loadChildren: () =>
          import(
            'src/app/Modules/medicalspeciality/medicalspeciality.module'
          ).then((m) => m.MedicalspecialityModule),
      },
   
      {
        path: 'accounts',
        loadChildren: () =>
          import('src/app/Modules/users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('src/app/Modules/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
      {
        path: 'seminar',
        loadChildren: () =>
          import('src/app/Modules/seminar/seminar.module').then(
            (m) => m.SeminarModule
          ),
      },
      {
        path: 'room',
        loadChildren: () =>
          import('src/app/Modules/room/room.module').then((m) => m.RoomModule),
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('src/app/Modules/schedule/schedule.module').then(
            (m) => m.ScheduleModule
          ),
      },
      {
        path: 'newsletter',
        loadChildren: () =>
          import('src/app/Modules/newsletter/newsletter.module').then(
            (m) => m.NewsletterModule
          ),
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
