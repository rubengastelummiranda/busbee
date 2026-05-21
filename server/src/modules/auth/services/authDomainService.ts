import { AuthRepository } from '../domain/repositories/auth.repository';
import { User } from '../domain/schemas/user';
import { AuthResponse } from '../domain/types/AuthResponse';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

export class AuthDomainService implements AuthService {
  constructor(private authRepository: AuthRepository) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(data: Partial<User>): Promise<AuthResponse | Error> {
    if (!data.email || !data.password || !data.name) {
      return new Error('Name, email, and password are required');
    }

    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      return new Error('Email is already registered');
    }

    // Hash password before saving
    const hashedPassword = this.hashPassword(data.password);
    const userData = {
      ...data,
      password: hashedPassword,
    };

    return this.authRepository.create(userData);
  }

  async login(email: string, password: string): Promise<AuthResponse | Error> {
    if (!email || !password) {
      return new Error('Email and password are required');
    }

    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      return new Error('Invalid credentials');
    }

    const hashedInput = this.hashPassword(password);
    if (user.password !== hashedInput) {
      return new Error('Invalid credentials');
    }

    return {
      message: 'Login successful',
      success: true,
      user,
    };
  }

  async listUsers(): Promise<User[]> {
    return this.authRepository.findAll();
  }

  async deleteUser(id: string): Promise<void | Error> {
    return this.authRepository.delete(id);
  }
}
