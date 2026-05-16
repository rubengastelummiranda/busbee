import { Travel } from '../domain/schemas/Travel';
import { TravelResponse } from '../domain/types/TravelsResponse';

export interface TravelService {
  createTravel(data: Partial<Travel>): Promise<TravelResponse | Error>;
  //getTravelById(id: string): Promise<Travel | null>;
  listTravels(): Promise<Travel[]>;

  updateTravel(id: string, data: Partial<Travel>): Promise<TravelResponse | Error>;
  
  deleteTravel(id: string): Promise<void | Error>;
}
