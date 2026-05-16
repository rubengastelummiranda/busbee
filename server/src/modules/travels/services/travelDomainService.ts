import { TravelRepository } from '../domain/repositories/travel.repository';
import { Travel } from '../domain/schemas/Travel';
import { TravelResponse } from '../domain/types/TravelsResponse';
import { TravelService } from './travel.service';
//patron de diseño repositorio-
export class TravelDomainService implements TravelService {
  // repository:TravelRepository
  constructor(private repository: TravelRepository) {
    //this.repository = repository
  }
  async createTravel(data: Partial<Travel>): Promise<TravelResponse | Error> {
    const repository = this.repository;
    return repository.create(data);
  }
  async listTravels(): Promise<Travel[]> {
    const repository = this.repository;
    return repository.findAll();
  }
  async updateTravel(id: string, data: Partial<Travel>): Promise<TravelResponse | Error> {
    const repository = this.repository;
    return repository.update(id,data)
  }
  async deleteTravel(id: string): Promise< void | Error> {
    const repository = this.repository;
    return repository.delete(id);
  }
}
