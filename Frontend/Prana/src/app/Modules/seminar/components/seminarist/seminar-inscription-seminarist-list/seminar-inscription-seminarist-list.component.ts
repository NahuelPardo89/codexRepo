import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeminarInscriptionAdminGetDetailInterface } from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';

@Component({
  selector: 'app-seminar-inscription-seminarist-list',
  templateUrl: './seminar-inscription-seminarist-list.component.html',
  styleUrls: ['./seminar-inscription-seminarist-list.component.css'],
})
export class SeminarInscriptionSeminaristListComponent {
  displayedColumns: string[] = [
    'seminar',
    'patient',
    'seminar_status',
    'meetingNumber',
  ];
  dataSource!: MatTableDataSource<SeminarInscriptionAdminGetDetailInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentSeminar: SeminarAdminInterface = history.state.seminar;
  constructor(private seminarInscriptionService: SeminarInscriptionService) {}

  /**
   * Initializes the component and sets the data table.
   * @author Alvaro Olguin
   */
  ngOnInit() {
    this.setDataTable();
  }

  /**
   * Sets the data table with the inscriptions data of a seminar.
   * @author Alvaro Olguin
   */
  setDataTable() {
    this.seminarInscriptionService
      .getSeminarInscriptionsDetailById(history.state.seminar.id)
      .subscribe((data) => {
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

  /**
   * Applies a filter to the data source when an event is triggered.
   * @param {Event} event - The event that triggered the filter.
   * @author Alvaro Olguin
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
