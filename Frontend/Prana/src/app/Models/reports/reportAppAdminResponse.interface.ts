import { AppointmentAdminGetInterface } from '../appointments/appointmentAdmin.interface';

export interface ReportAppAdminResponseInterface {
  summary: {
    doctor: number;
    specialty: number;
    branch: number;
    payment_method: number;
    num_patients: number;
    num_doctors: number;
    num_particular_insurances: number;
    num_other_insurances: number;
    num_appointments: number;
    total_patient_copayment: number;
    total_hi_copayment: number;
  };
  appointments: AppointmentAdminGetInterface[];
}

export interface ReportAppAdminSummaryResponseInterface {
  [key: string]: number | undefined;
  doctor: number;
  specialty: number;
  branch: number;
  payment_method: number;
  num_patients: number;
  num_doctors: number;
  num_particular_insurances: number;
  num_other_insurances: number;
  num_appointments: number;
  total_patient_copayment: number;
  total_hi_copayment: number;
}
