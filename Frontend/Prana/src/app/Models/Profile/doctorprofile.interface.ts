export interface DoctorProfile {
  id: number;
  user: number; // integer (User)
  medicLicence: string | null; // string or null (Matrícula) <= 20 characters
  specialty: string[]; // Array of integers unique
  insurances: string[]; // Array of integers unique
  is_active: boolean; // boolean (Is active)
  appointment_duration: string;
  copayment: number;
}
