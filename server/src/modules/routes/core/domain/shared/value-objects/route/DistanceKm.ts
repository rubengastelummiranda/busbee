export class DistanceKm {
  private constructor(public readonly value: number) {}

  public static create(distance: number): DistanceKm {
    if (distance < 0) {
      throw new Error('Distance cannot be negative');
    }
    return new DistanceKm(distance);
  }
}
