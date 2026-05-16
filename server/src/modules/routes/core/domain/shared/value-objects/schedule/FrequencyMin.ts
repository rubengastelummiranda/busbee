export class FrequencyMin {
  private constructor(public readonly value: number) {}

  public static create(minutes: number): FrequencyMin {
    if (minutes <= 0 || !Number.isInteger(minutes)) {
      throw new Error('Frequency must be a positive integer in minutes');
    }
    return new FrequencyMin(minutes);
  }
}
