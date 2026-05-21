import { Module, Provider } from '@nestjs/common';
import { AuthController } from './infrastructure/presentation/controllers/auth.controller';
import { AuthRepository } from './domain/repositories/auth.repository';
import { AuthDomainService } from './services/authDomainService';
import type { AuthService } from './services/auth.service';
import { AuthServiceContainer } from './infrastructure/presentation/AuthServiceContainer';
import {
  AUTH_REPOSITORY_PROVIDER,
  AUTH_SERVICE_CONTAINER,
  AUTH_SERVICE_PROVIDER,
} from './auth.constants';
import { PostgresUserRepository } from './infrastructure/postgres/repositories/postgres.user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/postgres/entities/user.entities';

export const authRepositoryProvider: Provider = {
  provide: AUTH_REPOSITORY_PROVIDER,
  useClass: PostgresUserRepository,
};

export const authServiceProvider: Provider = {
  provide: AUTH_SERVICE_PROVIDER,
  useFactory: (repository: AuthRepository) => {
    return new AuthDomainService(repository);
  },
  inject: [AUTH_REPOSITORY_PROVIDER],
};

export const authServiceContainer: Provider = {
  provide: AUTH_SERVICE_CONTAINER,
  useFactory: (service: AuthService) => {
    return new AuthServiceContainer(service);
  },
  inject: [AUTH_SERVICE_PROVIDER],
};

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [authRepositoryProvider, authServiceProvider, authServiceContainer],
})
export class AuthModule {}
