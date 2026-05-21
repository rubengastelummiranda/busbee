import { Controller, Get, Post, Body, Inject, Param, Delete, HttpStatus, HttpCode, BadRequestException } from '@nestjs/common';
import { AuthServiceContainer } from '../AuthServiceContainer';
import { User } from '../../../domain/schemas/user';
import { AuthResponse } from '../../../domain/types/AuthResponse';
import { AUTH_SERVICE_CONTAINER } from '../../../auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_CONTAINER)
    private readonly authServiceContainer: AuthServiceContainer,
  ) {}

  @Post('register')
  async register(@Body() data: Partial<User>): Promise<AuthResponse> {
    const result = await this.authServiceContainer.register(data);
    if (result instanceof Error) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: { email?: string; password?: string }): Promise<AuthResponse> {
    const result = await this.authServiceContainer.login(data.email ?? '', data.password ?? '');
    if (result instanceof Error) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Get('users')
  async listUsers(): Promise<User[]> {
    return this.authServiceContainer.listUsers();
  }

  @Delete('delete/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const result = await this.authServiceContainer.deleteUser(id);
    if (result instanceof Error) {
      throw new BadRequestException(result.message);
    }
  }
}
