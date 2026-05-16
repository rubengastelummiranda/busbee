export class DwellTimeSec {
  private constructor(public readonly value: number) {}

  public static create(seconds: number): DwellTimeSec {
    if (seconds < 0 || !Number.isInteger(seconds)) {
      throw new Error('Dwell time must be a positive integer or zero sec');
    }
    return new DwellTimeSec(seconds);
  }
}
