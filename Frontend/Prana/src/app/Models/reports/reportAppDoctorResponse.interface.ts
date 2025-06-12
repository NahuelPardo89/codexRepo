import { SpecialityBranch } from "../Profile/branch.interface";
import { DoctorProfile } from "../Profile/doctorprofile.interface";
import { HealthInsurance } from "../Profile/healthinsurance.interface";
import { Medicalspeciality } from "../Profile/medicalspeciality.interface";

export interface ReportAppDoctorResponseInterface {
    doctor: DoctorProfile,
    insurances: HealthInsurance[],
    branches: SpecialityBranch[],
    specialty: Medicalspeciality
}