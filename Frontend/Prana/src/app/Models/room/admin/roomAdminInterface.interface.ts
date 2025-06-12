export interface RoomAdminInterface {
  id?: number;
  name: string;
  capacity: number;
  cost: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}
