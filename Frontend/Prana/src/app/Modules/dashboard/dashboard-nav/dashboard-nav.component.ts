import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { AuthService } from 'src/app/Services/auth/auth.service';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.css'],
})
export class DashboardNavComponent {
  isScreenSmall!: boolean;
  availableRoles: string[] = [];
  currentRole: string = '';
  showRoleSelector: boolean = false;
  showInsuranceOptions = false;
  showUserOptions = false;
  showSeminarOptions = false;
  showAppoimentPatientOptions = false;
  showSeminarPatientOptions = false;
  showSeminarSeminaristOptions = false;
  showDoctorEspecialityOptions = false;
  showContableOptions = false;
  proffesional: DoctorProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private doctorService: DoctorprofileService
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.availableRoles = this.authService.getUserRoles();
    this.authService.currentRoleSubject.subscribe((role: string) => {
      this.currentRole = role;
    });
    this.doctorService.getMyDoctorProfile().subscribe((data) => {
      this.proffesional = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreenSmall = window.innerWidth < 1020;
  }

  changeRole(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Asegura que event.target es un elemento select
    const newRole = selectElement.value;
    if (newRole) {
      this.authService.setCurrentRole(newRole);
      //this.router.navigate(['Dashboard']);
    }
  }

  toggleRoleSelector(): void {
    this.showRoleSelector = !this.showRoleSelector;
  }

  toggleInsuranceOptions() {
    this.showInsuranceOptions = !this.showInsuranceOptions;
  }
  toggleContableOptions() {
    this.showContableOptions = !this.showContableOptions;
  }
  toggleUserOptions() {
    this.showUserOptions = !this.showUserOptions;
  }
  toggleSeminarOptions() {
    this.showSeminarOptions = !this.showSeminarOptions;
  }
  toggleAppoimentPatientOptions() {
    this.showAppoimentPatientOptions = !this.showAppoimentPatientOptions;
  }

  toggleSeminarPatientOptions() {
    this.showSeminarPatientOptions = !this.showSeminarPatientOptions;
  }
  toggleSeminarSeminaristOptions() {
    this.showSeminarSeminaristOptions = !this.showSeminarSeminaristOptions;
  }

  toggleDoctorEspecialityOptions() {
    this.showDoctorEspecialityOptions = !this.showDoctorEspecialityOptions;
  }

  scrollToStaff() {
    const targetElement = document.getElementById('option');

    if (targetElement) {
      const offset = window.innerHeight * 0.3;
      const targetPosition = targetElement.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }

  /**
   * navigates to the doctor's schedule page with the specified
   * doctor information.
   */
  MydoctorSchedule() {
    this.router.navigate(['Dashboard/accounts/doctores/schedule/'], {
      state: { doctor: this.proffesional },
    });
  }
}
