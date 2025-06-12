import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalspecialityRoutingModule } from './medicalspeciality-routing.module';
import { ListespecialityComponent } from './components/speciality/list-especiality/listespeciality.component';
import { CreateespecialityComponent } from './components/speciality/create-especiality/createespeciality.component';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { EditEspecialityComponent } from './components/speciality/edit-especiality/edit-especiality.component';
import { ListSpecialityBranchComponent } from './components/specialityBranch/admin/list-speciality-branch/list-speciality-branch.component';
import { EditSpecialityBranchComponent } from './components/specialityBranch/admin/edit-speciality-branch/edit-speciality-branch.component';
import { CreateSpecialityBranchComponent } from './components/specialityBranch/admin/create-speciality-branch/create-speciality-branch.component';
import { ListSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/list-speciality-branch-doctor/list-speciality-branch-doctor.component';
import { EditSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/edit-speciality-branch-doctor/edit-speciality-branch-doctor.component';
import { CreateSpecialityBranchDoctorComponent } from './components/specialityBranch/doctor/create-speciality-branch-doctor/create-speciality-branch-doctor.component';


@NgModule({
  declarations: [
    ListespecialityComponent,
    CreateespecialityComponent,
    EditEspecialityComponent,
    ListSpecialityBranchComponent,
    EditSpecialityBranchComponent,
    CreateSpecialityBranchComponent,
    ListSpecialityBranchDoctorComponent,
    EditSpecialityBranchDoctorComponent,
    CreateSpecialityBranchDoctorComponent
  ],
  imports: [
    CommonModule,
    MedicalspecialityRoutingModule,
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
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [SpecialityService]
})
export class MedicalspecialityModule { }
