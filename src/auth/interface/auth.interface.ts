/* eslint-disable prettier/prettier */
export interface RegisterSuccessMessage {
  message: string;
}
export interface UserPayload {
  id?: number;
  name?: string;
  userName?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: any;
  status?: boolean;
}
