export class RouteCode {
  private constructor(public readonly value: string) {}

  public static create(code: string): RouteCode {
    if (!code || code.trim().length === 0) {
      throw new Error('Route code cannot be empty');
    }
    return new RouteCode(code.trim().toUpperCase());
  }
}
