export interface InsurancePlanPatient {
  id: number;  
  patient: number; // ID del paciente (referencia a PatientProfile)
    insurance: number; // ID de la mutual (referencia a HealthInsurance)
    code: string | null; // Código, puede ser nulo o una cadena
  }