import { Route } from '../../schemas/Route';
import { UpdateRouteDTO } from '../../dtos/UpdateRoute.dto';
// import { UpdateRouteDTO } from '../../shared/dtos/Routes.dto';

export interface RouteRepository {
  findById(id: string): Promise<Route | null>;
  findAll(): Promise<Route[]>;
  save(route: Route): Promise<Route>;
  update(id: string, route: UpdateRouteDTO): Promise<Route>;
  delete(id: string): Promise<void>;
}
