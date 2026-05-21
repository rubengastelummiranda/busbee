import { User } from '../schemas/user';

export interface AuthResponse {
  message: string;
  success: boolean;
  user?: User;
}
