import { Vehicle } from '../domain/schemas/vehicles';
import { VehicleResponse } from '../domain/types/VehicleResponse';
 
export interface VehicleService {
  createVehicle(data: Partial<Vehicle>): Promise<VehicleResponse | Error>;
  
  listVehicles(): Promise<Vehicle[]>;
}