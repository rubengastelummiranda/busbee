import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../domain/schemas/vehicles';
import { VehicleResponse } from '../../domain/types/VehicleResponse';

export class VehicleServiceContainer {
  constructor(private vehicleService: VehicleService) {}

  async createVehicle(data: Partial<Vehicle>): Promise<VehicleResponse | Error> {
    return this.vehicleService.createVehicle(data);
  }

  async listVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.listVehicles();

  }
  async editVehicle(id: string, data: Partial<Vehicle>): Promise<VehicleResponse | Error>{
    return this.vehicleService.editVehicles(id,data);
  }

  async deleteVehicle(id: string): Promise<void | Error>{
    return this.vehicleService.deleteVehicles(id);
  }
}