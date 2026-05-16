export class StopId {
  private constructor(public readonly value: string) {}

  public static create(id: string): StopId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format for StopId');
    }
    return new StopId(id);
  }
}
