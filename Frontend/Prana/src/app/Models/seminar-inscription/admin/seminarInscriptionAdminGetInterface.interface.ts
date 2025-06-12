export interface SeminarInscriptionAdminGetInterface {
  id: number;
  seminar: number;
  patient: number;
  meetingNumber: number;
  seminar_status: number;
  insurance: number;
  patient_copayment: number;
  hi_copayment: number;
  payment_method: number | null;
  payment_status: number;
  created_at: string;
  updated_at: string;
  created_by: number;
}
