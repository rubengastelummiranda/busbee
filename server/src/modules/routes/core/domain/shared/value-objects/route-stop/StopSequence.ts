export class StopSequence {
  private constructor(public readonly value: number) {}

  public static create(sequence: number): StopSequence {
    if (sequence <= 0 || !Number.isInteger(sequence)) {
      throw new Error('Stop sequence must be a positive integer');
    }
    return new StopSequence(sequence);
  }
}
