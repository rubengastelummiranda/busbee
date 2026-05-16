import { Route } from '../../schemas/Route';
import { CreateRouteDTO } from '../../dtos/CreateRoute.dto';
import { UpdateRouteDTO } from '../../dtos/UpdateRoute.dto';

export interface RouteService {
  createRoute(routeData: CreateRouteDTO): Promise<Route>;
  getRouteById(routeId: string): Promise<Route | null>;
  updateRoute(routeId: string, updateData: UpdateRouteDTO): Promise<Route>;
  deleteRoute(routeId: string): Promise<void>;
}
