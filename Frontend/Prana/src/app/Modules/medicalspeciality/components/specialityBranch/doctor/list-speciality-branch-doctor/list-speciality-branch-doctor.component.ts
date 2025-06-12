import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-list-speciality-branch-doctor',
  templateUrl: './list-speciality-branch-doctor.component.html',
  styleUrls: ['./list-speciality-branch-doctor.component.css']
})
export class ListSpecialityBranchDoctorComponent {
  displayedColumns: string[] = [
    
    'name',
    'speciality',
    'is_active',
    'actions',
  ];
  dataSource!: MatTableDataSource<SpecialityBranch>;
  showInactive: boolean = false;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private specialityBranchService: BranchService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setDataTable();
  }

  setDataTable() {
    this.specialityBranchService.getMeSpecialityBranches().subscribe((data) => {
      
      const filteredData = this.showInactive
        ? data
        : data.filter((d) => d.is_active);

      this.dataSource = new MatTableDataSource(filteredData);

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
  onShowInactiveChange() {
    this.setDataTable();
  }

  editBranch(branch: SpecialityBranch) {
    const doctor=true
    this.router.navigate(['Dashboard/speciality/branch/edit'], {
      state: { branch, doctor},
    });
  }

  deleteBranch(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas desactivar esta Rama de Especialidad?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      if (confirmResult) {
        this.specialityBranchService.deleteSpecialityBranch(id).subscribe({
          next: () => {
            this.setDataTable();
            this.dialogService.showSuccessDialog('Rama Desactivada con éxito');
          },
          error: (error) => {
            this.dialogService.showErrorDialog(
              'Hubo un error al Desactivar el Rama'
            );
          },
        });
      }
    });
  }

  activeBranch(branch: SpecialityBranch) {
    branch.is_active = true;
    this.specialityBranchService
      .updateSpecialityBranch(branch.id, branch)
      .subscribe({
        next: () => {
          this.dialogService.showSuccessDialog('Rama Activada con éxito');
          this.setDataTable();
        },
        error: (error) => {
          this.dialogService.showErrorDialog('Error al Activar el Rama');
          // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
        },
      });
  }
}
