import { CreateRouteDTO } from '../../../domain/dtos/CreateRoute.dto';
import { UpdateRouteDTO } from '../../../domain/dtos/UpdateRoute.dto';
import { Route } from '../../../domain/schemas/Route';
import { CreateRouteStopDTO } from '../../../domain/dtos/CreateRouteStop.dto';
import { CreateScheduleDTO } from '../../../domain/dtos/CreateSchedule.dto';

export interface RouteApplication {
  createRoute(routeData: CreateRouteDTO): Promise<Route>;
  getRouteById(routeId: string): Promise<Route | null>;
  findAllRoutes(): Promise<Route[]>;
  updateRoute(routeId: string, updateData: UpdateRouteDTO): Promise<Route>;
  deleteRoute(routeId: string): Promise<void>;
  addNewStopToRoute(routeId: string, stopData: CreateRouteStopDTO): Promise<void>;
  removeStopFromRoute(routeId: string, stopId: string): Promise<void>;
  addScheduleToRoute(routeId: string, scheduleData: CreateScheduleDTO): Promise<void>;
  removeScheduleFromRoute(routeId: string, scheduleId: string): Promise<void>;
}
