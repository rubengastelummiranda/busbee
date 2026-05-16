export class DurationMin {
  private constructor(public readonly value: number) {}

  public static create(minutes: number): DurationMin {
    if (minutes < 0) {
      throw new Error('Duration cannot be negative');
    }
    return new DurationMin(Math.round(minutes));
  }
}
