import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { AppointmentAdminListComponent } from './components/admin/appointment-admin-list/appointment-admin-list.component';
import { AppointmentAdminDetailComponent } from './components/admin/appointment-admin-detail/appointment-admin-detail.component';
import { AppointmentAdminCreateComponent } from './components/admin/appointment-admin-create/appointment-admin-create.component';
import { AppointmentAdminUpdateComponent } from './components/admin/appointment-admin-update/appointment-admin-update.component';
import { AppointmentAdminDeleteComponent } from './components/admin/appointment-admin-delete/appointment-admin-delete.component';
import { AppointmentDoctorCreateComponent } from './components/doctor/appointment-doctor-create/appointment-doctor-create.component';
import { AppointmentDoctorDeleteComponent } from './components/doctor/appointment-doctor-delete/appointment-doctor-delete.component';
import { AppointmentDoctorDetailComponent } from './components/doctor/appointment-doctor-detail/appointment-doctor-detail.component';
import { AppointmentDoctorListComponent } from './components/doctor/appointment-doctor-list/appointment-doctor-list.component';
import { AppointmentDoctorUpdateComponent } from './components/doctor/appointment-doctor-update/appointment-doctor-update.component';
import { AppointmentPatientCreateComponent } from './components/patient/appointment-patient-create/appointment-patient-create.component';
import { AppointmentPatientDeleteComponent } from './components/patient/appointment-patient-delete/appointment-patient-delete.component';
import { AppointmentPatientDetailComponent } from './components/patient/appointment-patient-detail/appointment-patient-detail.component';
import { AppointmentPatientListComponent } from './components/patient/appointment-patient-list/appointment-patient-list.component';
import { AppointmentPatientUpdateComponent } from './components/patient/appointment-patient-update/appointment-patient-update.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'list/create', component: AppointmentAdminCreateComponent },
      { path: 'list', component: AppointmentAdminListComponent },
      { path: 'detail/id', component: AppointmentAdminDetailComponent },
      { path: 'update', component: AppointmentAdminUpdateComponent },
      { path: 'delete/:id', component: AppointmentAdminDeleteComponent },
    ],
  },
  {
    path: 'doctor',
    children: [
      { path: 'create', component: AppointmentDoctorCreateComponent },
      { path: 'list', component: AppointmentDoctorListComponent },
      { path: 'detail/:id', component: AppointmentDoctorDetailComponent },
      { path: 'update', component: AppointmentDoctorUpdateComponent },
      { path: 'delete/:id', component: AppointmentDoctorDeleteComponent },
    ],
  },
  {
    path: 'patient',
    children: [
      { path: 'create', component: AppointmentPatientCreateComponent },
      { path: 'list', component: AppointmentPatientListComponent },
      { path: 'detail/:id', component: AppointmentPatientDetailComponent },
      { path: 'update/:id', component: AppointmentPatientUpdateComponent },
      { path: 'delete/:id', component: AppointmentPatientDeleteComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
