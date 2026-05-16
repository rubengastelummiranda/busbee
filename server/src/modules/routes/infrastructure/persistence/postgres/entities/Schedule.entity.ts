import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RouteEntity } from './Route.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({ name: 'route_id', type: 'uuid' })
  public routeId!: string;

  @ManyToOne(() => RouteEntity)
  @JoinColumn({ name: 'route_id' })
  public route?: RouteEntity;

  @Column({ type: 'json' })
  public daysOfWeek!: number[];

  @Column({ type: 'json' })
  public departureTimes!: string[];

  @Column({ type: 'double precision', nullable: true })
  public frequencyMin?: number;

  @Column({ type: 'timestamptz' })
  public validFrom!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  public validUntil?: Date;

  @Column({ type: 'boolean' })
  public isHoliday!: boolean;
}
