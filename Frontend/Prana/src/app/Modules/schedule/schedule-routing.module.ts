import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleAdminCreateComponent } from './components/admin/schedule-admin-create/schedule-admin-create.component';
import { ScheduleAdminListComponent } from './components/admin/schedule-admin-list/schedule-admin-list.component';
import { ScheduleAdminUpdateComponent } from './components/admin/schedule-admin-update/schedule-admin-update.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'create', component: ScheduleAdminCreateComponent },
      { path: 'list', component: ScheduleAdminListComponent },
      { path: 'update', component: ScheduleAdminUpdateComponent },
    ],
  },
  {
    path: 'doctor',
    children: [],
  },
  {
    path: 'patient',
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
