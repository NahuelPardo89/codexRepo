import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { User } from 'src/app/Models/user/user.interface';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
})
export class MyaccountComponent {
  user!: User;
  doctor!: DoctorProfile;
  patient!: Patient;
  showUser: boolean = false;
  showPatient: boolean = false;
  showDoctor: boolean = false;
  hasDoctorProfile: boolean = false;
  roles: string[] =[]

  constructor(
    private userService: UserService,
    private doctorService: DoctorprofileService,
    private patientService: PatientService,
    private router:Router,
    private authService: AuthService
  ) {
    this.roles=this.authService.getUserRoles()
    
    this.userService.getLoggedUser().subscribe((user) => {
      this.user = user;
      
    });

    
  
    this.patientService.getCurrentPatient().subscribe((patient) => {
      this.patient = patient;
      
    });

    if (this.roles.includes('Profesional')) {
      this.hasDoctorProfile = true;
      this.doctorService.getMyDoctorProfile().subscribe((doctor) => {
        this.doctor = doctor;
        
      });
    }
  }
  showUserdata() {
    this.showUser = !this.showUser;
  }

  showPatientdata() {
    this.showPatient = !this.showPatient;
  }

  showDoctordata() {
    this.showDoctor = !this.showDoctor;
  }

  editUser(user: User) {
    this.router.navigate(['Dashboard/accounts/myaccount/edituser'], {
      state: { user },
    });
  }

  editpassword() {
    this.router.navigate(['Dashboard/accounts/myaccount/editpassword'], 
    );
  }

  editPatient(patient: Patient) {
    this.router.navigate(['Dashboard/accounts/myaccount/editpatient'], {
      state: { patient },
    });
  }

  editDoctor(doctor: DoctorProfile) {
    this.router.navigate(['Dashboard/accounts/myaccount/editdoctor'], {
      state: { doctor },
    });
  }

  editInstagram(){
    this.router.navigate(['Dashboard/accounts/myaccount/editinstagram'], 
    );
  }
}
