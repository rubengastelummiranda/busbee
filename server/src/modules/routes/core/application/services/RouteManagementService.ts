import { RouteService } from '../../domain/ports/inbound/RouteService';
import { RouteStopService } from '../../domain/ports/inbound/RouteStopService';
import { ScheduleService } from '../../domain/ports/inbound/ScheduleService';
import { Route } from '../../domain/schemas/Route';
import { CreateRouteDTO } from '../../domain/dtos/CreateRoute.dto';
import { UpdateRouteDTO } from '../../domain/dtos/UpdateRoute.dto';
import { CreateRouteStopDTO } from '../../domain/dtos/CreateRouteStop.dto';
import { CreateScheduleDTO } from '../../domain/dtos/CreateSchedule.dto';
import { RouteApplication } from '../ports/inbound/RouteApplication';

export class RoutesManagerApplicationService implements RouteApplication {
  constructor(
    private readonly routeService: RouteService,
    private readonly stopService: RouteStopService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async createRoute(routeData: CreateRouteDTO): Promise<Route> {
    return this.routeService.createRoute(routeData);
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    return this.routeService.getRouteById(routeId);
  }

  async findAllRoutes(): Promise<Route[]> {
    return this.routeService.findAllRoutes();
  }

  async updateRoute(
    routeId: string,
    updateData: UpdateRouteDTO,
  ): Promise<Route> {
    return this.routeService.updateRoute(routeId, updateData);
  }

  async deleteRoute(routeId: string): Promise<void> {
    await this.routeService.deleteRoute(routeId);
  }

  async addNewStopToRoute(
    routeId: string,
    stopData: CreateRouteStopDTO,
  ): Promise<void> {
    await this.stopService.addRouteStopToRoute(routeId, stopData);
  }

  async removeStopFromRoute(routeId: string, stopId: string): Promise<void> {
    await this.stopService.removeRouteStopFromRoute(routeId, stopId);
  }

  async addScheduleToRoute(
    routeId: string,
    scheduleData: CreateScheduleDTO,
  ): Promise<void> {
    await this.scheduleService.assignScheduleToRoute(routeId, scheduleData);
  }

  async removeScheduleFromRoute(
    routeId: string,
    scheduleId: string,
  ): Promise<void> {
    await this.scheduleService.unassignScheduleFromRoute(routeId, scheduleId);
  }
}
