export interface SeminaristProfileFlatInterface {
  id?: number;
  user: number;
  insurances: number[];
  is_active: boolean;
}

export interface SeminaristProfileDisplayInterface {
  id?: number;
  user: string;
  insurances: string[];
  is_active: boolean;
}
