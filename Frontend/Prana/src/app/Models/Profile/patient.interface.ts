export interface Patient {
  id: number;
  user: number;
  facebook: string;
  instagram: string;
  address: string;
  is_active: boolean;
  insurance: string[];
}

export interface PatientView {
  id: number;
  user: string;
  facebook: string;
  instagram: string;
  address: string;
  is_active: boolean;
  insurances: string[];
}
