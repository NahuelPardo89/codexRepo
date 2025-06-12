import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { User } from 'src/app/Models/user/user.interface';
import { SeminaristService } from 'src/app/Services/Profile/seminarist/seminarist.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-seminarist-create',
  templateUrl: './seminarist-create.component.html',
  styleUrls: ['./seminarist-create.component.css'],
})
export class SeminaristCreateComponent {
  users: User[] = [];
  filteredUsers: Observable<User[]> = new Observable<User[]>();
  seminaristForm: FormGroup;
  userControl = new FormControl('', Validators.required);

  constructor(
    private seminaristProfileService: SeminaristService,

    private userService: UserService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router
  ) {
    this.seminaristForm = this.fb.group({
      user: this.userControl,
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filterUsers();
    });
  }

  filterUsers() {
    this.filteredUsers = this.seminaristForm.get('user')!.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filterUsers(name) : this.users.slice()))
    );
  }

  onSubmit(): void {
    if (this.seminaristForm.valid) {
      const userid = this.seminaristForm.value.user.id;

      this.seminaristForm.value.user = userid;
      this.seminaristProfileService
        .createSeminarist(this.seminaristForm.value)
        .subscribe({
          next: (response) => {
            this.dialog.showSuccessDialog('Tallerista creado correctamente');
            this.router.navigate(['/Dashboard/accounts/seminarist']);
          },
          error: (error) => {
            
            this.dialog.showErrorDialog(error.error.message);
          },
        });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/accounts/seminarist']);
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
