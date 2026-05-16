export class RouteColor {
  private constructor(public readonly value: string) {}

  public static create(hex: string): RouteColor {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hex)) {
      throw new Error('Invalid color hex format');
    }
    return new RouteColor(hex.toUpperCase());
  }
}
