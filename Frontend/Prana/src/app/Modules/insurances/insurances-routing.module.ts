import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInsuranceComponent } from './componentes/insurance/list-insurance/list-insurance.component';
import { CreateInsuranceComponent } from './componentes/insurance/create-insurance/create-insurance.component';
import { EditInsuranceComponent } from './componentes/insurance/edit-insurance/edit-insurance.component';
import { ListInsurancePatientComponent } from './componentes/insurancePlanPratient/list-insurance-patient/list-insurance-patient.component';
import { CreateInsurancePatientComponent } from './componentes/insurancePlanPratient/create-insurance-patient/create-insurance-patient.component';
import { EditInsurancePatientComponent } from './componentes/insurancePlanPratient/edit-insurance-patient/edit-insurance-patient.component';
import { ListInsuranceDoctorComponent } from './componentes/insurancePlanDoctor/admin/list-insurance-doctor/list-insurance-doctor.component';
import { CreateInsuranceDoctorComponent } from './componentes/insurancePlanDoctor/admin/create-insurance-doctor/create-insurance-doctor.component';
import { EditInsuranceDoctorComponent } from './componentes/insurancePlanDoctor/admin/edit-insurance-doctor/edit-insurance-doctor.component';
import { ListInsuranceDoctorUserComponent } from './componentes/insurancePlanDoctor/doctor/list-insurance-doctor-user/list-insurance-doctor-user.component';
import { EditInsuranceDoctorUserComponent } from './componentes/insurancePlanDoctor/doctor/edit-insurance-doctor-user/edit-insurance-doctor-user.component';
import { CreateInsuranceDoctorUserComponent } from './componentes/insurancePlanDoctor/doctor/create-insurance-doctor-user/create-insurance-doctor-user.component';

const routes: Routes = [

  { 
    path: 'insurance', 
    children: [
      { path: '', component: ListInsuranceComponent },
      { path: 'create', component: CreateInsuranceComponent },
      { path: 'edit', component: EditInsuranceComponent },
    ]
  },
  { 
    path: 'patient', 
    children: [
      { path: '', component: ListInsurancePatientComponent },
      { path: 'create', component: CreateInsurancePatientComponent },
      { path: 'edit', component: EditInsurancePatientComponent },
    ]
  },
  { 
    path: 'doctor', 
    children: [
      { path: '', component: ListInsuranceDoctorComponent },
      { path: 'create', component: CreateInsuranceDoctorComponent },
      { path: 'edit', component: EditInsuranceDoctorComponent },
      { path: 'me',children: [
        { path: '', component: ListInsuranceDoctorUserComponent },
        { path: 'edit', component: EditInsuranceDoctorUserComponent },
        { path: 'create', component: CreateInsuranceDoctorUserComponent }
      ]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancesRoutingModule { }
