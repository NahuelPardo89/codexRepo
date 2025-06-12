import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { DoctorReportsComponent } from './components/doctor-reports/doctor-reports.component';
import { ReportService } from 'src/app/Services/reports/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { MatSelectModule } from '@angular/material/select';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SpecialtyFilterService } from 'src/app/Services/Profile/speciality/specialty-filter/specialty-filter.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentMethodListComponent } from './components/payment-method/payment-method-list/payment-method-list.component';
import { PaymentMethodCreateComponent } from './components/payment-method/payment-method-create/payment-method-create.component';
import { PaymentMethodEditComponent } from './components/payment-method/payment-method-edit/payment-method-edit.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AdminReportListComponent } from './components/admin-report-list/admin-report-list.component';
import { DoctorReportListComponent } from './components/doctor-report-list/doctor-report-list.component';

@NgModule({
  declarations: [
    AdminReportsComponent,
    DoctorReportsComponent,
    PaymentMethodListComponent,
    PaymentMethodCreateComponent,
    PaymentMethodEditComponent,
    AdminReportListComponent,
    DoctorReportListComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    ReportService,
    DoctorprofileService,
    SpecialityService,
    BranchService,
    PatientService,
    HealthinsuranceService,
    SpecialtyFilterService,
    PaymentmethodService,
    DialogService,
  ],
})
export class ReportsModule {}
