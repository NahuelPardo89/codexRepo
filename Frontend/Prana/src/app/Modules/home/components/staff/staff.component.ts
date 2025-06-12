import { Component, OnInit, HostListener } from '@angular/core';
import { StaffService } from 'src/app/Services/staff.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  webInstragram: string = '';
  showObjectives = false;
  dataSource!: MatTableDataSource<Patient>;
  staff: any[] = [];
  sliderImages: string[] = [
   
  ];

  constructor(
    private staffService: StaffService,
    private router: Router,
    private patientService: PatientService,
    private sanitizer: DomSanitizer
  ) {}

  getIg() {
    this.patientService.getAllPatients().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filter = 'PRANA';
      this.webInstragram = this.dataSource.filteredData[0].instagram;
    });
  }

  get instagramUrl(): SafeResourceUrl {
    const unsafeUrl = `https://www.instagram.com/${this.webInstragram}/embed/`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  scrollToSection() {
    const targetElement = document.getElementById('encontrarnos');
    if (targetElement) {
      const offset = window.innerHeight * 0.3;
      const targetPosition = targetElement.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  scrollToBodyNav() {
    const targetElement = document.getElementById('bodyNav');
    if (targetElement) {
      const offset = window.innerHeight * 0.1;
      const targetPosition = targetElement.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  navigateToAboutUs() {
    this.router.navigate(['/aboutus']);
  }

  navigateToProf() {
    this.router.navigate(['/profesionales']);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const element = document.querySelector('.objetivos');
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        this.showObjectives = true;
      }
    }
  }

  ngOnInit(): void {
    this.staffService.getStaff().subscribe(data => {
      this.staff = data.profesionales.map((pro: any) => ({ ...pro, showDescription: false }));
    });
    this.getIg();
  }
}
