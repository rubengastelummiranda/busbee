import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RouteEntity } from './Route.entity';

@Entity({ name: 'route_stops' })
export class RouteStopEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public routeId!: string;

  @ManyToOne(() => RouteEntity, (route) => route.routeStops)
  @JoinColumn({ name: 'route_id' })
  public route?: RouteEntity;

  @Column({ type: 'uuid' })
  public stopId!: string;

  @Column({ type: 'int' })
  public sequence!: number;

  @Column({ type: 'double precision' })
  public distanceFromStartKm!: number;

  @Column({ type: 'double precision' })
  public estimatedMinFromStart!: number;

  @Column({ type: 'double precision' })
  public dwellTimeSec!: number;

  @Column({ type: 'boolean' })
  public isTerminal!: boolean;

  @Column({ type: 'boolean' })
  public isTimepoint!: boolean;

  @Column({ type: 'boolean' })
  public onDemand!: boolean;
}
