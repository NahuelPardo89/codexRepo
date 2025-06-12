import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { User } from 'src/app/Models/user/user.interface';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-create',
  templateUrl: './doctor-create.component.html',
  styleUrls: ['./doctor-create.component.css'],
})
export class DoctorCreateComponent {
  specialties: Medicalspeciality[] = [];
  users: User[] = [];
  filteredUsers: Observable<User[]> = new Observable<User[]>();
  doctorForm: FormGroup;
  userControl = new FormControl('', Validators.required);
  durationOptions = [
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: '20 min', value: 20 * 60 },
    { label: '25 min', value: 25 * 60 },
    { label: '30 min', value: 30 * 60 },
    { label: '35 min', value: 35 * 60 },
    { label: '40 min', value: 40 * 60 },
    { label: '45 min', value: 45 * 60 },
    { label: '50 min', value: 50 * 60 },
    { label: '55 min', value: 55 * 60 },
    { label: '60 min', value: 60 * 60 },
    { label: '75 min', value: 75 * 60 },
    { label: '90 min', value: 90 * 60 },
  ];
  constructor(
    private doctorProfileService: DoctorprofileService,
    private specialtyService: SpecialityService,
    private userService: UserService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router
  ) {
    this.doctorForm = this.fb.group({
      user: this.userControl,
      medicLicence: ['', Validators.required],
      specialty: ['', Validators.required],
      appointment_duration: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSpecialties();
    this.loadUsers();
  }

  loadSpecialties(): void {
    this.specialtyService.getSpecialities().subscribe((data) => {
      this.specialties = data.filter(specialty => specialty.is_active);
    });
  }
  

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filterUsers();
    });
  }

  filterUsers() {
    this.filteredUsers = this.doctorForm.get('user')!.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filterUsers(name) : this.users.slice()))
    );
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      const userid = this.doctorForm.value.user.id;
      const specialty = this.doctorForm.value.specialty;
      this.doctorForm.value.specialty = [specialty];
      this.doctorForm.value.user = userid;
      this.doctorProfileService.createDoctor(this.doctorForm.value).subscribe({
        next: (response) => {
          this.dialog.showSuccessDialog(
            'Profesional creado correctamente, recuerde asignar las obra social PARTICULAR y sus horarios'
          );
          this.router.navigate(['/Dashboard/accounts/doctores']);
        },
        error: (error) => {
          this.dialog.showErrorDialog(error.error.message);
        },
      });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/accounts/doctores']);
  }

  displayUser(user: User): string {
    return user ? `${user.name} ${user.last_name}` : '';
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name!.toLowerCase().includes(filterValue) ||
        user.last_name!.toLowerCase().includes(filterValue)
    );
  }
}
