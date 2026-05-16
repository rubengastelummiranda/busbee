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

  async edit(id: string, vehicle: Partial<Vehicle>): Promise<VehicleResponse | Error> {
  const index = this.vehicles.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error('Vehículo no encontrado.');
  }
  this.vehicles[index] = Vehicle.create({ ...this.vehicles[index], ...vehicle });
  return {
    message: 'vehículo actualizado exitosamente',
    succes: true,
    vehicle: this.vehicles[index],
  };
}

async delete(id: string): Promise<void | Error> {
  const index = this.vehicles.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error('Vehículo no encontrado.');
  }
  this.vehicles.splice(index, 1);
}
}