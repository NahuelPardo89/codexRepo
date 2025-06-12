import { AppointmentDoctorCreateInterface } from "./appointmentDoctorCreate.interface";

export interface AppointmentAdminCreateInterface extends AppointmentDoctorCreateInterface {
  full_cost?: number
  health_insurance?: number
}