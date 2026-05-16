export interface Coordinate {
  lat: number;
  lng: number;
}

export class BoundingBox {
  private constructor(
    public readonly ne: Coordinate,
    public readonly sw: Coordinate,
  ) {}

  public static create(ne: Coordinate, sw: Coordinate): BoundingBox {
    if (!ne || !sw) {
      throw new Error('Bounding box must have NE and SW coordinates');
    }
    if (ne.lat < sw.lat) {
      throw new Error('NE latitude must be greater than SW latitude');
    }
    return new BoundingBox(ne, sw);
  }
}
