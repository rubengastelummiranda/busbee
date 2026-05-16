import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteStopEntity } from '../persistence/postgres/entities/RouteStop.entity';
import { RouteStopRepository } from '../../core/domain/ports/outbound/RouteStopRepository';
import { RouteStop } from '../../core/domain/schemas/RouteStop';
import { UpdateRouteStopDTO } from '../../core/domain/dtos/UpdateRouteStop.dto';
import { RouteId } from '../../core/domain/shared/value-objects/route/RouteId';
import { StopId } from '../../core/domain/shared/value-objects/route-stop/StopId';
import { StopSequence } from '../../core/domain/shared/value-objects/route-stop/StopSequence';
import { DistanceFromStartKm } from '../../core/domain/shared/value-objects/route-stop/DistanceFromStartKm';
import { EstimatedMinFromStart } from '../../core/domain/shared/value-objects/route-stop/EstimatedMinFromStart';
import { DwellTimeSec } from '../../core/domain/shared/value-objects/route-stop/DwellTimeSec';

@Injectable()
export class RouteStopRepositoryAdapter implements RouteStopRepository {
  constructor(
    @InjectRepository(RouteStopEntity)
    private readonly routeStopRepo: Repository<RouteStopEntity>,
  ) {}

  async findById(id: string): Promise<RouteStop | null> {
    const entity = await this.routeStopRepo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRouteId(routeId: string): Promise<RouteStop[]> {
    const entities = await this.routeStopRepo.findBy({ routeId });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(routeStop: RouteStop): Promise<void> {
    await this.routeStopRepo.save(routeStop.toPrimitives());
  }

  async update(id: string, routeStop: UpdateRouteStopDTO): Promise<RouteStop> {
    const existing = await this.routeStopRepo.findOneBy({ id });
    if (!existing) {
      throw new Error('RouteStop not found');
    }

    // Directamente inyectamos el DTO de actualización porque ahora son datos primitivos
    await this.routeStopRepo.update({ id }, routeStop);

    const updatedData = await this.routeStopRepo.findOneBy({ id });
    return this.toDomain(updatedData!);
  }

  async delete(id: string): Promise<void> {
    await this.routeStopRepo.delete(id);
  }

  private toDomain(entity: RouteStopEntity): RouteStop {
    return RouteStop.create({
      id: entity.id,
      routeId: RouteId.create(entity.routeId),
      stopId: StopId.create(entity.stopId),
      sequence: StopSequence.create(entity.sequence),
      distanceFromStartKm: DistanceFromStartKm.create(
        entity.distanceFromStartKm,
      ),
      estimatedMinFromStart: EstimatedMinFromStart.create(
        entity.estimatedMinFromStart,
      ),
      dwellTimeSec: DwellTimeSec.create(entity.dwellTimeSec),
      isTerminal: entity.isTerminal,
      isTimepoint: entity.isTimepoint,
      onDemand: entity.onDemand,
    });
  }
}
