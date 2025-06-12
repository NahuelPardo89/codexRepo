export interface SeminarInscriptionAdminGetDetailInterface {
  id: number;
  seminar: string;
  patient: string;
  meetingNumber: number;
  seminar_status: string;
  insurance: string;
  patient_copayment: number;
  hi_copayment: number;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SeminarInscriptionAdminGetFlatInterface {
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
  created_by: string;
}

export interface SeminarInscriptionAdminPostInterface {
  seminar: number;
  patient: number;
  meetingNumber: number;
  seminar_status: number;
  insurance?: number;
  patient_copayment?: number;
  hi_copayment?: number;
  payment_method?: number;
  payment_status: number;
}

export interface SeminarInscriptionPatientPostInterface {
  seminar: number;
  patient: number;
  meetingNumber: number;
}
