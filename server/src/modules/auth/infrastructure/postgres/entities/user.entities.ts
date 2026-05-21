import { User } from 'src/modules/auth/domain/schemas/user';
import { UserType } from 'src/modules/auth/domain/types/user-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.APP })
  type!: UserType;

  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.type = user.type;
    return entity;
  }

  toDomain(): User {
    return User.create({
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      type: this.type,
    });
  }
}
