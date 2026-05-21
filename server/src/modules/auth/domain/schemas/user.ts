import { UserType } from '../types/user-type.enum';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;

  private constructor(data: Partial<User> = {}) {
    this.id = data.id ?? '';
    this.name = data.name ?? '';
    this.email = data.email ?? '';
    this.password = data.password ?? '';
    this.type = data.type ?? UserType.APP;
  }

  static create(data: Partial<User> = {}): User {
    return new User(data);
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      type: this.type,
    };
  }
}
