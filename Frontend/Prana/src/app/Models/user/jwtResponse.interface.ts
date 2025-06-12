import { UserShort } from "./userShort.interface";

export interface JwtResponse {
  user: UserShort;
  refresh: string;
  access: string;
  roles: string[];
}
