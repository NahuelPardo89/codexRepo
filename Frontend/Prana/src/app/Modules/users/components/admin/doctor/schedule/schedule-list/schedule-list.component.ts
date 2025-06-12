import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorScheduleInterface } from 'src/app/Models/Profile/doctorschedule.interface';
import { DoctorscheduleService } from 'src/app/Services/Profile/doctorschedule/doctorschedule.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent {
  doctorName=""
  doctorId!:number
  doctor!:DoctorProfile
  displayedColumns: string[] = [
    
    'day',
    'start',
    'end',
    'actions'
    
  ];
  dataSource!: MatTableDataSource<DoctorScheduleInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private doctorScheduleService: DoctorscheduleService,
    private dialogService: DialogService,
    private router: Router
  ) {
    if (history.state.doctor) {
      
      this.doctorName = history.state.doctor.user;
      this.doctorId = history.state.doctor.id
      this.doctor=history.state.doctor
    }
  }

  ngOnInit() {
    this.setDataTable();
    
  }



  setDataTable() {
    this.doctorScheduleService.getDoctorSchedule(this.doctorId).subscribe((data) => {
      const translatedAndSortedData = data
        .map(schedule => ({
          ...schedule,
          day: this.translateDay(schedule.day)
        }))
        .sort((a, b) => this.getDayValue(a.day) - this.getDayValue(b.day));
    
      this.dataSource = new MatTableDataSource(translatedAndSortedData);
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

  

  translateDay(day: string): string {
    const dayTranslations: { [key: string]: string } = {
      'mon': 'Lunes',
      'tue': 'Martes',
      'wed': 'Miércoles',
      'thu': 'Jueves',
      'fri': 'Viernes',
      'sat': 'Sábado',
      'sun': 'Domingo',
    };
    return dayTranslations[day] || day;
  }
  getDayValue(day: string): number {
    const order: { [key: string]: number } = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
    };
    
    return order[day] ?? 0; 
  }
  createSchedule(){
    const doctor=this.doctor
    this.router.navigate(['Dashboard/accounts/doctores/schedule/create'], {
      state: { doctor },
    });
  }
  editSchedule(schedule: DoctorScheduleInterface) {
    const doctor=this.doctor
    this.router.navigate(['Dashboard/accounts/doctores/schedule/edit'], {
      state: { schedule, doctor },
    });
  }

 
  deleteSchedule(id: number) {
    const confirmDialogRef = this.dialogService.openConfirmDialog(
      '¿Estás seguro de que deseas eliminar este Horario?'
    );

    confirmDialogRef.afterClosed().subscribe((confirmResult) => {
      
      if (confirmResult) {
        this.doctorScheduleService.deleteDoctor(id).subscribe({
          next: () => {
            this.setDataTable();
            this.dialogService.showSuccessDialog(
              'horario eliminado con éxito'
            );
          },
          error: (error) => {
            this.dialogService.showErrorDialog(
              'Hubo un error al eliminar el horario'
            );
          },
        });
      }
    });
  }
 
}
