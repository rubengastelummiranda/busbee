import { VehicleRepository } from '../../../domain/repositories/vehicles.repository';
import { Vehicle } from '../../../domain/schemas/vehicles';
import { VehicleResponse } from '../../../domain/types/VehicleResponse';

export class MockVehicleRepository implements VehicleRepository {
   constructor(private vehicles: Vehicle[] = []) {}

  async create(vehicle: Partial<Vehicle>): Promise<VehicleResponse | Error> {
    const newVehicle = Vehicle.create({ ...vehicle, id: crypto.randomUUID() });
    this.vehicles.push(newVehicle);
    return {
      message: 'vehículo creado exitosamente',
      succes: true,
      vehicle: newVehicle,
    };
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicles;
  }
}