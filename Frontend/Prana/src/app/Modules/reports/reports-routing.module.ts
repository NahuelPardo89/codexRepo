import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { DoctorReportsComponent } from './components/doctor-reports/doctor-reports.component';
import { PaymentMethodListComponent } from './components/payment-method/payment-method-list/payment-method-list.component';
import { PaymentMethodCreateComponent } from './components/payment-method/payment-method-create/payment-method-create.component';
import { PaymentMethodEditComponent } from './components/payment-method/payment-method-edit/payment-method-edit.component';
import { AdminReportListComponent } from './components/admin-report-list/admin-report-list.component';
import { DoctorReportListComponent } from './components/doctor-report-list/doctor-report-list.component';

const routes: Routes = [
  {
    path: 'copayment',
    children: [
      {
        path: 'appointment',
        children: [
          {
            path: 'admin',
            children: [
              { path: 'list', component: AdminReportsComponent },
              { path: 'list-detail', component: AdminReportListComponent },
            ],
          },
          {
            path: 'doctor',
            children: [
              { path: 'list', component: DoctorReportsComponent },
              { path: 'list-detail', component: DoctorReportListComponent },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'payment-method',
    children: [
      { path: '', component: PaymentMethodListComponent },
      { path: 'create', component: PaymentMethodCreateComponent },
      { path: 'edit', component: PaymentMethodEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
