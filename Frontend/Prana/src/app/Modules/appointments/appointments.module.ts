import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentAdminListComponent } from './components/admin/appointment-admin-list/appointment-admin-list.component';
import { AppointmentAdminDetailComponent } from './components/admin/appointment-admin-detail/appointment-admin-detail.component';
import { AppointmentAdminCreateComponent } from './components/admin/appointment-admin-create/appointment-admin-create.component';
import { AppointmentAdminUpdateComponent } from './components/admin/appointment-admin-update/appointment-admin-update.component';
import { AppointmentAdminDeleteComponent } from './components/admin/appointment-admin-delete/appointment-admin-delete.component';
import { AppointmentService } from 'src/app/Services/appointments/appointment.service';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { MatSelectModule } from '@angular/material/select';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { SpecialtyFilterService } from 'src/app/Services/Profile/speciality/specialty-filter/specialty-filter.service';
import { DoctorscheduleService } from 'src/app/Services/Profile/doctorschedule/doctorschedule.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppointmentAdminListComponent,
    AppointmentAdminDetailComponent,
    AppointmentAdminCreateComponent,
    AppointmentAdminUpdateComponent,
    AppointmentAdminDeleteComponent,
    AppointmentDoctorCreateComponent,
    AppointmentDoctorDeleteComponent,
    AppointmentDoctorDetailComponent,
    AppointmentDoctorListComponent,
    AppointmentDoctorUpdateComponent,
    AppointmentPatientCreateComponent,
    AppointmentPatientDeleteComponent,
    AppointmentPatientDetailComponent,
    AppointmentPatientListComponent,
    AppointmentPatientUpdateComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  providers: [
    AppointmentService,
    DoctorprofileService,
    SpecialityService,
    BranchService,
    AppointmentService,
    PatientService,
    PaymentmethodService,
    HealthinsuranceService,
    SpecialtyFilterService,
    DoctorscheduleService]
})
export class AppointmentsModule { }
