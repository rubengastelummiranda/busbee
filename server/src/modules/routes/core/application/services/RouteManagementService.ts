import { RouteService } from '../../domain/ports/inbound/RouteService';
import { RouteStopService } from '../../domain/ports/inbound/RouteStopService';
import { ScheduleService } from '../../domain/ports/inbound/ScheduleService';
import { Route } from '../../domain/schemas/Route';
import { CreateRouteDTO } from '../../domain/dtos/CreateRoute.dto';
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

  async addNewStopToRoute(
    routeId: string,
    stopData: CreateRouteStopDTO,
  ): Promise<void> {
    await this.stopService.addRouteStopToRoute(routeId, stopData);
  }

  async addScheduleToRoute(
    routeId: string,
    scheduleData: CreateScheduleDTO,
  ): Promise<void> {
    await this.scheduleService.assignScheduleToRoute(routeId, scheduleData);
  }
}
