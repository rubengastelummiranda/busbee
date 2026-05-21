import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from 'src/modules/auth/domain/repositories/auth.repository';
import { User } from 'src/modules/auth/domain/schemas/user';
import { AuthResponse } from 'src/modules/auth/domain/types/AuthResponse';
import { UserEntity } from '../entities/user.entities';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

export class PostgresUserRepository implements AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
  ) {}

  private toDomainList(data: UserEntity[]): User[] {
    return data.map((user: UserEntity) => user.toDomain());
  }

  async create(user: Partial<User>): Promise<AuthResponse | Error> {
    const newUser = User.create({ ...user, id: crypto.randomUUID() });
    
    const entity = UserEntity.fromDomain(newUser);
    await this.userEntityRepository.save(entity);

    return {
      message: 'Usuario registrado exitosamente',
      success: true,
      user: newUser,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userEntityRepository.findOne({ where: { email } });
    return entity ? entity.toDomain() : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.userEntityRepository.find();
    return this.toDomainList(entities);
  }

  async delete(id: string): Promise<void | Error> {
    const exist = await this.userEntityRepository.findOne({ where: { id } });
    if (!exist) {
      throw new Error('Usuario no encontrado');
    }
    await this.userEntityRepository.delete(id);
  }
}
