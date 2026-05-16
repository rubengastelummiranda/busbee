import { TravelRepository } from '../../../domain/repositories/travel.repository';
import { Travel } from '../../../domain/schemas/Travel';
import { TravelResponse } from '../../../domain/types/TravelsResponse';
const mockTravel: Travel = Travel.create({
  id: '0123',
  origin: 'centro',
  destination: 'Union',
  passengerCount: 24,
});
export class MockRepository implements TravelRepository {
  constructor(private mockArray: Travel[] = []) {}
  async create(travel: Partial<Travel>): Promise<TravelResponse | Error> {
    const newTravel = Travel.create(travel);
    this.mockArray.push(newTravel);
    if (!newTravel) {
      throw new Error('Ocurrio un error inesperado.');
    }
    return {
      message: 'viaje creado exitosamente',
      succes: true,
      travel: newTravel,
    };
  }
  async findAll(): Promise<Travel[]> {
    return this.mockArray;
  }
  async update(id: string, travel: Partial<Travel>): Promise<TravelResponse | Error> {
    const index = this.mockArray.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Viaje no encontrado.');
    }
    this.mockArray[index] = Travel.create({ ...this.mockArray[index], ...travel });
    return {
      message: 'viaje actualizado exitosamente',
      succes: true,
      travel: this.mockArray[index],
    };
  }
  async delete(id: string): Promise<void | Error> {
    const index = this.mockArray.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Viaje no encontrado.');
    }
    this.mockArray.splice(index, 1);
  }
}
