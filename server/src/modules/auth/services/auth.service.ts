import { User } from '../domain/schemas/user';
import { AuthResponse } from '../domain/types/AuthResponse';

export interface AuthService {
  register(data: Partial<User>): Promise<AuthResponse | Error>;
  login(email: string, password: string): Promise<AuthResponse | Error>;
  listUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void | Error>;
}
