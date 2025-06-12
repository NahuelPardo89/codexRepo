import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomAdminCreateComponent } from './components/admin/room-admin-create/room-admin-create.component';
import { RoomAdminListComponent } from './components/admin/room-admin-list/room-admin-list.component';
import { RoomAdminUpdateComponent } from './components/admin/room-admin-update/room-admin-update.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'create', component: RoomAdminCreateComponent },
      { path: 'list', component: RoomAdminListComponent },
      { path: 'update', component: RoomAdminUpdateComponent },
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
export class RoomRoutingModule {}
