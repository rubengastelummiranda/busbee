export class RouteStopId {
  private constructor(public readonly value: string) {}

  public static create(id: string): RouteStopId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format for RouteStopId');
    }
    return new RouteStopId(id);
  }

  public static generate(): RouteStopId {
    return new RouteStopId(crypto.randomUUID());
  }
}
