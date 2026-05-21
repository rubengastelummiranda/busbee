import { AuthService } from '../../services/auth.service';
import { User } from '../../domain/schemas/user';
import { AuthResponse } from '../../domain/types/AuthResponse';

export class AuthServiceContainer {
  constructor(private authService: AuthService) {}

  async register(data: Partial<User>): Promise<AuthResponse | Error> {
    return this.authService.register(data);
  }

  async login(email: string, password: string): Promise<AuthResponse | Error> {
    return this.authService.login(email, password);
  }

  async listUsers(): Promise<User[]> {
    return this.authService.listUsers();
  }

  async deleteUser(id: string): Promise<void | Error> {
    return this.authService.deleteUser(id);
  }
}
