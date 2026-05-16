export class RouteName {
  private constructor(public readonly value: string) {}

  public static create(name: string): RouteName {
    if (!name || name.trim().length === 0) {
      throw new Error('Route name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Route name is too long');
    }
    return new RouteName(name.trim());
  }
}
