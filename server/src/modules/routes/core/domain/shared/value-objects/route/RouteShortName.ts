export class RouteShortName {
  private constructor(public readonly value: string) {}

  public static create(name: string): RouteShortName {
    if (!name || name.trim().length === 0) {
      throw new Error('Route short name cannot be empty');
    }
    if (name.length > 15) {
      throw new Error('Route short name must be 15 characters or less');
    }
    return new RouteShortName(name.trim());
  }
}
