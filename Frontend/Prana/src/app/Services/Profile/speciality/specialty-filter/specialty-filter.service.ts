import { Injectable } from '@angular/core';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyFilterService {

  constructor() { }

  filterDoctorsBySpecialty(doctors: DoctorProfile[], specialtyId: number): DoctorProfile[] {
    return doctors.filter(doctor => doctor.specialty.includes(specialtyId.toString()));
  }

  filterDoctorsBySpecialtyName(doctors: DoctorProfile[], specialtyName: string): DoctorProfile[] {
    return doctors.filter(doctor => doctor.specialty.includes(specialtyName));
  }

  filterBranchesBySpecialtyName(branches: SpecialityBranch[], specialtyName: string): SpecialityBranch[] {
    return branches.filter(branches => branches.speciality.toString().toLocaleUpperCase() === specialtyName.toUpperCase());
  }

}
