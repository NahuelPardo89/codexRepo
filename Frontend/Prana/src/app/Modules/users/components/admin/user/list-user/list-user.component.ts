import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user/user.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent {
  displayedColumns: string[] = [
    'dni',
    'name',
    'last_name',
    'email',
    'phone',
    'is_active',
    'is_staff',
    'actions',
  ];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.paginator._intl.itemsPerPageLabel = 'items por página';
      this.paginator._intl.firstPageLabel = 'primera página';
      this.paginator._intl.lastPageLabel = 'última página';
      this.paginator._intl.nextPageLabel = 'página siguiente';
      this.paginator._intl.previousPageLabel = 'página anterior';

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: User) {
    this.router.navigate(['Dashboard/accounts/users/edit'], {
      state: { user },
    });
  }

  deleteUser(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar este usuario?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      console.log('eliminar usuario');
      if (confirmResult) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            // Manejo de la respuesta de eliminación exitosa
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'Usuario Desactivado con éxito'
            );

            // Aquí podrías, por ejemplo, recargar la lista de usuarios
          },
          error: (error) => {
            // Manejo de errores
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar el Usuario'
            );
          },
        });
      }
    });
  }

  activeUser(user: User) {
    user.is_active = true;

    this.userService.updateUser(user.id, user).subscribe({
      next: () => {
        console.log('Usuario actualizado con éxito');
        this.dialogService.showSuccessDialog('Usuario Activado con éxito');

        this.setDataTable();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario', error);
        this.dialogService.showErrorDialog('Error al Activar el usuario');
        // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
      },
    });
  }
}
