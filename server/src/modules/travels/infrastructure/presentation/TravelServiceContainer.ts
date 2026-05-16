import { Injectable } from '@nestjs/common';
import { Travel } from '../../domain/schemas/Travel';
import { TravelService } from '../../services/travel.service';
import { TravelContainer } from './controllers/travel.controller';
import { TravelResponse } from '../../domain/types/TravelsResponse';

export class TravelServiceContainer implements TravelContainer {
  constructor(private service: TravelService) {}
  create(data: Partial<Travel>) {
    return this.service.createTravel(data);
  }
  findAll() {
    return this.service.listTravels();
  }
  async update(id: string, data:Partial<Travel>): Promise<TravelResponse | Error >{
    const service = this.service;
      return service.updateTravel(id,data);
  }
  async delete(id: string): Promise<void | Error >{
    const service = this.service;
    return service.deleteTravel(id);
  }
}
