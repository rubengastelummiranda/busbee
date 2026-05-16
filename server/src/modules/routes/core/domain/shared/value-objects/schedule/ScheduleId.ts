export class ScheduleId {
  private constructor(public readonly value: string) {}

  public static create(id: string): ScheduleId {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Invalid UUID format for ScheduleId');
    }
    return new ScheduleId(id);
  }

  public static generate(): ScheduleId {
    return new ScheduleId(crypto.randomUUID());
  }
}
