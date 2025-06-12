import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListespecialityComponent } from './components/speciality/list-especiality/listespeciality.component';
import { CreateespecialityComponent } from './components/speciality/create-especiality/createespeciality.component';
import { EditEspecialityComponent } from './components/speciality/edit-especiality/edit-especiality.component';
import { ListSpecialityBranchComponent } from './components/specialityBranch/admin/list-speciality-branch/list-speciality-branch.component';
import { CreateSpecialityBranchComponent } from './components/specialityBranch/admin/create-speciality-branch/create-speciality-branch.component';
import { EditSpecialityBranchComponent } from './components/specialityBranch/admin/edit-speciality-branch/edit-speciality-branch.component';
import { ListSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/list-speciality-branch-doctor/list-speciality-branch-doctor.component';
import { CreateSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/create-speciality-branch-doctor/create-speciality-branch-doctor.component';
import { EditSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/edit-speciality-branch-doctor/edit-speciality-branch-doctor.component';

const routes: Routes = [
  
  { 
    path: 'speciality', 
    children: [
      { path: '', component: ListespecialityComponent },
      { path: 'create', component: CreateespecialityComponent },
      { path: 'edit', component: EditEspecialityComponent }, //
    ]
  },
  { 
    path: 'branch', 
    children: [
      { path: '', component: ListSpecialityBranchComponent },
      { path: 'create', component: CreateSpecialityBranchComponent },
      { path: 'edit', component: EditSpecialityBranchComponent }, //
      {path:'me',
        children: [
          { path: '', component: ListSpecialityBranchDoctorComponent },
          { path: 'create', component: CreateSpecialityBranchDoctorComponent },
          { path: 'edit', component: EditSpecialityBranchDoctorComponent },
        ]
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalspecialityRoutingModule { }
