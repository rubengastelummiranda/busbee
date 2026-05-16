export class RouteIcon {
  private constructor(public readonly value: string) {}

  public static create(icon: string): RouteIcon {
    if (!icon || icon.trim().length === 0) {
      throw new Error('Route icon cannot be empty');
    }
    return new RouteIcon(icon.trim());
  }
}
