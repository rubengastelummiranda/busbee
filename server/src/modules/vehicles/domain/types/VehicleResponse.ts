import { Vehicle } from "../schemas/vehicles";

export interface VehicleResponse {
     message: String;
      succes: boolean;
      vehicle: Vehicle;
}