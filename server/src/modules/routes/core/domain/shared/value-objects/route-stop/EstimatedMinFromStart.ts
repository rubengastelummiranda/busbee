export class EstimatedMinFromStart {
  private constructor(public readonly value: number) {}

  public static create(minutes: number): EstimatedMinFromStart {
    if (minutes < 0 || !Number.isInteger(minutes)) {
      throw new Error(
        'Estimated minutes from start must be a positive integer or zero',
      );
    }
    return new EstimatedMinFromStart(minutes);
  }
}
