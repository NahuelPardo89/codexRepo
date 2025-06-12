export interface SeminarAdminInterface {
  id?: number;
  name: string;
  month: string;
  year: number;
  schedule: number[];
  meetingNumber: number;
  maxInscription: number;
  price: number;
  is_active: boolean;
  seminarist: number[];
  patients: number[];
  rooms?: number[];
}

export interface SeminarAdminDisplayInterface {
  id: number;
  name: string;
  month: string;
  year: number;
  schedule: string[];
  meetingNumber: number;
  maxInscription: number;
  price: number;
  is_active: boolean;
  seminarist: string[];
  patients: number[];
  rooms?: number[];
}
