import { Vehicle } from "src/modules/vehicles/domain/schemas/vehicles";
import { VehicleStatus } from "src/modules/vehicles/domain/types/vehicles-status.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  plateNumber!: string;

  @Column()
  deviceId!: string;

  @Column('int')
  capacity!: number;

  @Column({ nullable: true })
  currentRouteId?: string;

  @Column({type: 'decimal', nullable: true})
  lastLat?: number;

  @Column({type: 'decimal', nullable: true})
  lastLng?: number;

@Column({ type: 'float', nullable: true })
  lastHeading?: number;
 
  @Column({ type: 'float', nullable: true })
  lastSpeed?: number;
 
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSeenAt?: Date;
 
  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.OFFLINE })
  status!: VehicleStatus;

   static fromDomain(vehicle: Vehicle): VehicleEntity {
    const entity = new VehicleEntity();
    entity.id = vehicle.id;
    entity.plateNumber = vehicle.plateNumber;
    entity.deviceId = vehicle.deviceId;
    entity.capacity = vehicle.capacity;
    entity.currentRouteId = vehicle.currentRouteId;
    entity.lastLat = vehicle.lastLat;
    entity.lastLng = vehicle.lastLng;
    entity.lastHeading = vehicle.lastHeading;
    entity.lastSpeed = vehicle.lastSpeed;
    entity.lastSeenAt = vehicle.lastSeenAt;
    entity.status = vehicle.status;
    return entity;
  }
   toDomain(): Vehicle {
    return Vehicle.create({
      id: this.id,
      plateNumber: this.plateNumber,
      deviceId: this.deviceId,
      capacity: this.capacity,
      currentRouteId: this.currentRouteId,
      lastLat: this.lastLat,
      lastLng: this.lastLng,
      lastHeading: this.lastHeading,
      lastSpeed: this.lastSpeed,
      lastSeenAt: this.lastSeenAt,
      status: this.status,
    });
  }

}