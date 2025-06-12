import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  SeminarAdminDisplayInterface,
  SeminarAdminInterface,
} from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { SeminaristService } from 'src/app/Services/Profile/seminarist/seminarist.service';
import { SeminarService } from 'src/app/Services/seminar/seminar.service';

@Component({
  selector: 'app-seminar-seminarist-list',
  templateUrl: './seminar-seminarist-list.component.html',
  styleUrls: ['./seminar-seminarist-list.component.css'],
})
export class SeminarSeminaristListComponent {
  displayedColumns: string[] = [
    'name',
    'year',
    'month',
    'schedule',
    'meetingNumber',
    'maxInscription',
    'price',
    //'rooms',
    'seminarist',
    //'is_active',
    'actions',
  ];
  dataSource!: MatTableDataSource<SeminarAdminDisplayInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private seminarService: SeminarService,
    private seminaristService: SeminaristService,
    private router: Router
  ) {}

  /**
   * Initializes the component and sets the data table.
   * @author Alvaro Olguin
   */
  ngOnInit() {
    this.setDataTable();
  }

  /**
   * Sets the data table with seminars detailed list.
   * @author Alvaro Olguin
   */
  setDataTable() {
    this.seminaristService
      .getCurrentDisplaySeminarist()
      .subscribe((seminaristData) => {
        if (seminaristData) {
          this.seminarService.getSeminarsListAux().subscribe((data) => {
            // Filter the seminarist seminar's
            data = data.filter((seminar) =>
              seminar.seminarist.includes(seminaristData.user)
            );
            // Show only active seminars to patient
            let activeSeminars = data.filter((seminar) => seminar.is_active);
            this.dataSource = new MatTableDataSource(activeSeminars);
            this.paginator._intl.itemsPerPageLabel = 'items por página';
            this.paginator._intl.firstPageLabel = 'primera página';
            this.paginator._intl.lastPageLabel = 'última página';
            this.paginator._intl.nextPageLabel = 'página siguiente';
            this.paginator._intl.previousPageLabel = 'página anterior';
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
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

  /**
   * Redirects to the seminar inscription screen
   * @param {SeminarAdminInterface} seminar - The ID of the seminar to view.
   * @author Alvaro Olguin
   */
  onView(seminar: SeminarAdminInterface) {
    this.router.navigate(
      ['Dashboard/seminar/seminarist/seminar-inscription/list'],
      {
        state: { seminar },
      }
    );
  }
}
