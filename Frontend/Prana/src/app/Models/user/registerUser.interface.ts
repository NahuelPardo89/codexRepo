import { User } from "./user.interface";


export interface RegisterUser extends User {
    password: string;
  }