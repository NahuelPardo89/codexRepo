export interface User {
    id: number;
    dni: number;
    name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
    is_active: boolean;
    is_staff: boolean;
  }