import { RouteService } from '../ports/inbound/RouteService';
import { RouteRepository } from '../ports/outbound/RouteRepository';
import { Route } from '../schemas/Route';
import { RouteStop } from '../schemas/RouteStop';
import { CreateRouteDTO } from '../dtos/CreateRoute.dto';
import { UpdateRouteDTO } from '../dtos/UpdateRoute.dto';
import { RouteStatus } from '../shared/types/route-status.enum';

import { RouteCode } from '../shared/value-objects/route/RouteCode';
import { RouteName } from '../shared/value-objects/route/RouteName';
import { RouteShortName } from '../shared/value-objects/route/RouteShortName';
import { RouteColor } from '../shared/value-objects/route/RouteColor';
import { RouteIcon } from '../shared/value-objects/route/RouteIcon';
import { DistanceKm } from '../shared/value-objects/route/DistanceKm';
import { DurationMin } from '../shared/value-objects/route/DurationMin';
import { EncodedPolyline } from '../shared/value-objects/route/EncodedPolyline';
import { BoundingBox } from '../shared/value-objects/route/BoundingBox';

export class RouteDomainService implements RouteService {
  constructor(private repository: RouteRepository) {}

  async createRoute(routeData: CreateRouteDTO): Promise<Route> {
    const newRoute = Route.create({
      code: RouteCode.create(routeData.code),
      name: RouteName.create(routeData.name),
      shortName: routeData.shortName
        ? RouteShortName.create(routeData.shortName)
        : undefined,
      type: routeData.type,
      status: routeData.status,
      color: RouteColor.create(routeData.color),
      icon: routeData.icon ? RouteIcon.create(routeData.icon) : undefined,
      totalDistanceKm: DistanceKm.create(routeData.totalDistanceKm),
      estimatedDurationMin: DurationMin.create(routeData.estimatedDurationMin),
      polyline: EncodedPolyline.create(routeData.polyline),
      boundingBox: routeData.boundingBox
        ? BoundingBox.create(routeData.boundingBox.ne, routeData.boundingBox.sw)
        : undefined,
    });

    await this.repository.save(newRoute);
    return newRoute;
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    return this.repository.findById(routeId);
  }

  async updateRoute(
    routeId: string,
    updateData: UpdateRouteDTO,
  ): Promise<Route> {
    const existingRoute = await this.repository.findById(routeId);
    if (!existingRoute) {
      throw new Error('Route not found');
    }
    const res = await this.repository.update(routeId, updateData);
    return res;
  }

  async deleteRoute(routeId: string): Promise<void> {
    await this.repository.delete(routeId);
  }

  /**
   * Regla de negocio: Una ruta no puede considerarse ACTIVA si no tiene al menos 2 paradas (Origen y Destino).
   */
  private validateActivation(route: Route, stops: RouteStop[]): void {
    if (route.status === RouteStatus.ACTIVE && stops.length < 2) {
      throw new Error(
        'A Route must have at least two stops (origin and destination) to be ACTIVE.',
      );
    }
  }

  /**
   * Regla de negocio: El código de una ruta debe ser único a nivel sistema.
   * Esto se orquesta combinando el Value Object inicial con una comprobación en el repositorio.
   */

  private async ensureRouteCodeIsUnique(
    codeValue: string,
    checkExistsFn: (code: string) => Promise<boolean>,
  ): Promise<void> {
    const exists = await checkExistsFn(codeValue);
    if (exists) {
      throw new Error(`The route code '${codeValue}' is already in use.`);
    }
  }
}
