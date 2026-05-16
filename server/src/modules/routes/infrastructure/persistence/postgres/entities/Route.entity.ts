import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { RouteStopEntity } from './RouteStop.entity';

@Entity({ name: 'routes' })
export class RouteEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 64 })
  public code!: string;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  public shortName?: string;

  // Enumerations stored as string values
  @Column({ type: 'varchar', length: 64 })
  public type!: string;

  @Column({ type: 'varchar', length: 64 })
  public status!: string;

  @Column({ type: 'varchar', length: 64 })
  public color!: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  public icon?: string;

  @Column({ type: 'double precision' })
  public totalDistanceKm!: number;

  @Column({ type: 'double precision' })
  public estimatedDurationMin!: number;

  @Column({ type: 'text' })
  public polyline!: string;

  @Column({ type: 'json', nullable: true })
  public boundingBox?: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };

  // Relations
  @OneToMany(() => RouteStopEntity, (stop: RouteStopEntity) => stop.route)
  public routeStops?: RouteStopEntity[];
}
