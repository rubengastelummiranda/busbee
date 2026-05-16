export class DistanceFromStartKm {
  private constructor(public readonly value: number) {}

  public static create(distance: number): DistanceFromStartKm {
    if (distance < 0) {
      throw new Error('Distance from start cannot be negative');
    }
    return new DistanceFromStartKm(distance);
  }
}
