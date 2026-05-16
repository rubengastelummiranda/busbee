import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteEntity } from '../persistence/postgres/entities/Route.entity';
import { RouteRepository } from '../../core/domain/ports/outbound/RouteRepository';
import { Route } from '../../core/domain/schemas/Route';
import { RouteCode } from '../../core/domain/shared/value-objects/route/RouteCode';
import { RouteName } from '../../core/domain/shared/value-objects/route/RouteName';
import { RouteShortName } from '../../core/domain/shared/value-objects/route/RouteShortName';
import { RouteColor } from '../../core/domain/shared/value-objects/route/RouteColor';
import { RouteType } from '../../core/domain/shared/types/route-type.enum';
import { RouteIcon } from '../../core/domain/shared/value-objects/route/RouteIcon';
import { BoundingBox } from '../../core/domain/shared/value-objects/route/BoundingBox';
import { EncodedPolyline } from '../../core/domain/shared/value-objects/route/EncodedPolyline';
import { DurationMin } from '../../core/domain/shared/value-objects/route/DurationMin';
import { DistanceKm } from '../../core/domain/shared/value-objects/route/DistanceKm';
import { RouteStatus } from '../../core/domain/shared/types/route-status.enum';
import { UpdateRouteDTO } from '../../core/domain/dtos/UpdateRoute.dto';

// import {
//   CreateRouteDTO,
//   UpdateRouteDTO,
// } from '../../core/domain/shared/dtos/Routes.dto';

@Injectable()
export class RouteRepositoryAdapter implements RouteRepository {
  constructor(
    @InjectRepository(RouteEntity)
    private routeRepository: Repository<RouteEntity>,
  ) {}

  async findById(id: string): Promise<Route | null> {
    const routeEntity = await this.routeRepository.findOneBy({ id });
    return routeEntity ? this.toDomain(routeEntity) : null;
  }

  async findAll(): Promise<Route[]> {
    const routeEntities = await this.routeRepository.find({
      relations: ['stops'],
    });
    return routeEntities.map((routeEntity) => this.toDomain(routeEntity));
  }

  async save(route: Route): Promise<Route> {
    const savedEntity = await this.routeRepository.save(route.toPrimitives());
    return this.toDomain(savedEntity);
  }

  async update(id: string, route: UpdateRouteDTO): Promise<Route> {
    const updatedEntity = await this.routeRepository.findOneBy({ id });
    if (!updatedEntity) {
      throw new Error('Route not found');
    }

    // TypeORM recibe felizmente el DTO que ahora son datos primitivos 💪
    await this.routeRepository.update({ id }, route);

    // Obtenemos la entidad actualizada
    const updatedData = await this.routeRepository.findOneBy({ id });
    return this.toDomain(updatedData!);
  }
  async delete(id: string): Promise<void> {
    await this.routeRepository.delete(id);
  }

  private toDomain(routeEntity: RouteEntity): Route {
    return Route.create({
      id: routeEntity.id.toString(),
      code: RouteCode.create(routeEntity.code),
      name: RouteName.create(routeEntity.name),
      shortName: RouteShortName.create(routeEntity.shortName ?? ''),
      type: routeEntity.type as RouteType,
      status: routeEntity.status as RouteStatus,
      color: RouteColor.create(routeEntity.color),
      icon: RouteIcon.create(routeEntity.icon ?? ''),
      totalDistanceKm: DistanceKm.create(routeEntity.totalDistanceKm),
      estimatedDurationMin: DurationMin.create(
        routeEntity.estimatedDurationMin,
      ),
      polyline: EncodedPolyline.create(routeEntity.polyline),
      boundingBox: routeEntity.boundingBox
        ? BoundingBox.create(
            routeEntity.boundingBox.ne,
            routeEntity.boundingBox.sw,
          )
        : undefined,
    });
  }
}
