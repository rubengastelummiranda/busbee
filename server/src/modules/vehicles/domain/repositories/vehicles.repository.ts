import { Vehicle } from "../schemas/vehicles";
import { VehicleResponse } from "../types/VehicleResponse";

export interface VehicleRepository {

  create(vehicle: Partial<Vehicle>): Promise<VehicleResponse | Error>;
 
  findAll(): Promise<Vehicle[]>;
  
}