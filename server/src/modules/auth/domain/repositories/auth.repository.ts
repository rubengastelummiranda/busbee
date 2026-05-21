import { User } from '../schemas/user';
import { AuthResponse } from '../types/AuthResponse';

export interface AuthRepository {
  create(user: Partial<User>): Promise<AuthResponse | Error>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void | Error>;
}
