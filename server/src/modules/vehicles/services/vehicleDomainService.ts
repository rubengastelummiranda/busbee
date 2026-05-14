import { VehicleRepository } from '../domain/repositories/vehicles.repository';
import { Vehicle } from '../domain/schemas/vehicles';
import { VehicleResponse } from '../domain/types/VehicleResponse';
import { VehicleService } from './vehicle.service';
 
export class VehicleDomainService implements VehicleService {
  constructor(private  vehicleRepository: VehicleRepository) {}
 
  async createVehicle(data: Partial<Vehicle>): Promise<VehicleResponse | Error> {
    return this.vehicleRepository.create(data);
  }
 
  async listVehicles(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }
}