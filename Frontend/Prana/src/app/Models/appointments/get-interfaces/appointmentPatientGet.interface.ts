export interface AppointmentPatientGetInterface {
  day: Date;
  hour: string;
  doctor: number;
  patient: number;
  specialty: number;
  branch: number;
  health_insurance: number;
  duration: string;
  appointment_status: number;
  payment_status: number;
}
