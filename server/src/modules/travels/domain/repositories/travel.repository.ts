import { Travel } from '../schemas/Travel';
import { TravelResponse } from '../types/TravelsResponse';

export interface TravelRepository {
  create(travel: Partial<Travel>): Promise<TravelResponse | Error>;
  // findById(id: string): Promise<Travel | null>;
  findAll(): Promise<Travel[]>;
  
  update(id: string, travel: Partial<Travel>): Promise<TravelResponse | Error>;
  
  delete(id: string): Promise<void | Error>;
  

}
