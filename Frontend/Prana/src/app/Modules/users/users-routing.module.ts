import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './components/admin/user/list-user/list-user.component';
import { CreateUserComponent } from './components/admin/user/create-user/create-user.component';
import { EditUserComponent } from './components/admin/user/edit-user/edit-user.component';
import { PatientListComponent } from './components/admin/patient/patient-list/patient-list.component';
import { PatientEditComponent } from './components/admin/patient/patient-edit/patient-edit.component';
import { DoctorListComponent } from './components/admin/doctor/doctor-list/doctor-list.component';
import { DoctorEditComponent } from './components/admin/doctor/doctor-edit/doctor-edit.component';
import { DoctorCreateComponent } from './components/admin/doctor/doctor-create/doctor-create.component';
import { MyaccountComponent } from './components/myaccount/myaccount.component';
import { EditmyuserComponent } from './components/myaccount/editmyuser/editmyuser.component';
import { EditmypasswordComponent } from './components/myaccount/editmypassword/editmypassword.component';
import { EditmypatientComponent } from './components/myaccount/editmypatient/editmypatient.component';
import { EditmydoctorComponent } from './components/myaccount/editmydoctor/editmydoctor.component';
import { ScheduleListComponent } from './components/admin/doctor/schedule/schedule-list/schedule-list.component';
import { ScheduleEditComponent } from './components/admin/doctor/schedule/schedule-edit/schedule-edit.component';
import { ScheduleCreateComponent } from './components/admin/doctor/schedule/schedule-create/schedule-create.component';
import { SeminaristListComponent } from './components/admin/seminarist/seminarist-list/seminarist-list.component';
import { SeminaristCreateComponent } from './components/admin/seminarist/seminarist-create/seminarist-create.component';
import { SeminaristEditComponent } from './components/admin/seminarist/seminarist-edit/seminarist-edit.component';
import { InsuranceDoctorListComponent } from './components/admin/doctor/insurance/insurance-doctor-list/insurance-doctor-list.component';
import { InsuranceDoctorCreateComponent } from './components/admin/doctor/insurance/insurance-doctor-create/insurance-doctor-create.component';
import { InsuranceDoctorUpdateComponent } from './components/admin/doctor/insurance/insurance-doctor-update/insurance-doctor-update.component';
import { InsurancePatientListComponent } from './components/admin/patient/insurance/insurance-patient-list/insurance-patient-list.component';
import { InsurancePatientEditComponent } from './components/admin/patient/insurance/insurance-patient-edit/insurance-patient-edit.component';
import { InsurancePatientCreateComponent } from './components/admin/patient/insurance/insurance-patient-create/insurance-patient-create.component';
import { EditinstagramComponent } from './components/myaccount/editinstagram/editinstagram.component';


const routes: Routes = [
  { 
    path: 'users', 
    children: [
      { path: '', component: ListUserComponent },
      { path: 'create', component: CreateUserComponent },
      { path: 'edit', component: EditUserComponent },
    ]
  },
  { 
    path: 'pacientes', 
    children: [
      { path: '', component: PatientListComponent },
      { path: 'edit', component: PatientEditComponent },
      { path: 'insurance',children: [
        { path: '', component: InsurancePatientListComponent },
        { path: 'edit', component: InsurancePatientEditComponent },
        { path: 'create', component:  InsurancePatientCreateComponent }
      ]},
    ]
  },
  { 
    path: 'doctores', 
    children: [
      
      { path: '', component: DoctorListComponent },
      { path: 'create', component: DoctorCreateComponent },
      { path: 'edit', component: DoctorEditComponent },
      { path: 'schedule',children: [
        { path: '', component: ScheduleListComponent },
        { path: 'edit', component: ScheduleEditComponent },
        { path: 'create', component: ScheduleCreateComponent }
      ]},
      { path: 'insurance',children: [
        { path: '', component: InsuranceDoctorListComponent },
        { path: 'edit', component: InsuranceDoctorUpdateComponent },
        { path: 'create', component:  InsuranceDoctorCreateComponent }
      ]},
    ]
  },
  { 
    path: 'myaccount', 
    children: [
      
      { path: '', component: MyaccountComponent },
      { path: 'edituser', component: EditmyuserComponent },
      { path: 'editpassword', component: EditmypasswordComponent },
      { path: 'editpatient', component: EditmypatientComponent },
      { path: 'editdoctor', component: EditmydoctorComponent },
      { path: 'editinstagram', component: EditinstagramComponent },
      
    ]
  },
  { 
    path: 'seminarist', 
    children: [
      { path: '', component: SeminaristListComponent },
      { path: 'create', component: SeminaristCreateComponent },
      { path: 'edit', component: SeminaristEditComponent },
    ]
  },
  
    
  
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
