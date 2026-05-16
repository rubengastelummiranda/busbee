export class EncodedPolyline {
  private constructor(public readonly value: string) {}

  public static create(polyline: string): EncodedPolyline {
    if (!polyline || polyline.trim().length === 0) {
      throw new Error('Polyline cannot be empty');
    }
    return new EncodedPolyline(polyline.trim());
  }
}
