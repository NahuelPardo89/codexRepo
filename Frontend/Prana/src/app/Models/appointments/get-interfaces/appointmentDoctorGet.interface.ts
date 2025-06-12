import { AppointmentPatientGetInterface } from './appointmentPatientGet.interface';

export interface AppointmentDoctorGetInterface
  extends AppointmentPatientGetInterface {
  full_cost: number;
  payment_method: number;
  patient_copayment: number;
  appointment_type: number;
}
