import { RouteStop } from '../../schemas/RouteStop';
import { UpdateRouteStopDTO } from '../../dtos/UpdateRouteStop.dto';

export interface RouteStopRepository {
  findById(id: string): Promise<RouteStop | null>;
  findByRouteId(routeId: string): Promise<RouteStop[]>;
  save(routeStop: RouteStop): Promise<void>;
  update(id: string, routeStop: UpdateRouteStopDTO): Promise<RouteStop>;
  delete(id: string): Promise<void>;
}
