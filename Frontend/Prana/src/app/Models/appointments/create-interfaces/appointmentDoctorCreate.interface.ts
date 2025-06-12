import { AppointmentPatientCreateInterface } from './appointmentPatientCreate.interface';

export interface AppointmentDoctorCreateInterface
  extends AppointmentPatientCreateInterface {
  duration?: string;
  branch?: number;
  state?: number;
  payment_method?: number | null;
  appointment_status?: number;
  appointment_type?: number;
  payment_status?: number;
  patient_copayment?: number;
}
