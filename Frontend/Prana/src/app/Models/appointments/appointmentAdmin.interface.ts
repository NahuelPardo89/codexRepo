import { AppointmentDoctorGetInterface } from './get-interfaces/appointmentDoctorGet.interface';

export interface AppointmentAdminGetInterface
  extends AppointmentDoctorGetInterface {
  id: number;
  hi_copayment: number;
}
