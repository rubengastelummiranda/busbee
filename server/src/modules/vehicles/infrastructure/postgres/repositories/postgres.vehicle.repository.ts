import { InjectRepository } from '@nestjs/typeorm';
import { VehicleRepository } from 'src/modules/vehicles/domain/repositories/vehicles.repository';
import { Vehicle } from 'src/modules/vehicles/domain/schemas/vehicles';
import { VehicleResponse } from 'src/modules/vehicles/domain/types/VehicleResponse';
import { VehicleEntity } from '../entities/vehicle.entities';
import { Repository } from 'typeorm';

export class PostgresVehicleRepository implements VehicleRepository {

  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleEntityRepository: Repository<VehicleEntity>,
  ) {}

  private toDomain(data: VehicleEntity[]): Vehicle[] {
    return data.map((vehicle: VehicleEntity) => {
      const {
        id,
        plateNumber,
        deviceId,
        capacity,
        currentRouteId,
        lastLat,
        lastLng,
        lastHeading,
        lastSpeed,
        lastSeenAt,
        status,
      } = vehicle;
      return Vehicle.create({
        id,
        plateNumber,
        deviceId,
        capacity,
        currentRouteId,
        lastLat,
        lastLng,
        lastHeading,
        lastSpeed,
        lastSeenAt,
        status,
      });
    });
  }

  async create(vehicle: Partial<Vehicle>): Promise<VehicleResponse | Error> {
    const newVehicle = Vehicle.create({ ...vehicle, id: crypto.randomUUID() });
    await this.vehicleEntityRepository.save(newVehicle);
    if (!newVehicle) {
      throw new Error('Ocurrió un error inesperado.');
    }
    return {
      message: 'vehículo creado exitosamente',
      succes: true,
      vehicle: newVehicle,
    };
  }

  async findAll(): Promise<Vehicle[]> {
    const format = await this.vehicleEntityRepository.find();
    return this.toDomain(format);
  }

  async edit(id: string, vehicle:Partial<Vehicle>): Promise<VehicleResponse | Error>{
    await this.vehicleEntityRepository.update(id, vehicle);
    const update = await this.vehicleEntityRepository.findOne({where:{id}});
    if (!update){
      throw new Error ("Vehiculo no encontrado")
    }
    return {
      message: 'Vehículo actualizado exitosamente',
      succes: true,
      vehicle: update.toDomain(),
    }
  }
  async delete(id: string): Promise<void | Error>{
     const exist = await this.vehicleEntityRepository.findOne({where:{id}})
     if(!exist){
      throw new Error ('vehiculo no encontrado');
     }
     await this.vehicleEntityRepository.delete(id);
  }
}