import { DynamicModule, Module, Type } from '@nestjs/common';
import { RouteRepository } from './domain/ports/outbound/RouteRepository';
import { RouteStopRepository } from './domain/ports/outbound/RouteStopRepository';
import { ScheduleRepository } from './domain/ports/outbound/ScheduleRepository';
import { RoutesManagerApplicationService } from './application/services/RouteManagementService';
import { RouteDomainService } from './domain/services/RouteDomainService';
import { RouteService } from './domain/ports/inbound/RouteService';
import { ScheduleService } from './domain/ports/inbound/ScheduleService';
import { RouteStopService } from './domain/ports/inbound/RouteStopService';
import { RouteStopDomainService } from './domain/services/RouteStopDomainService';
import { ScheduleDomainService } from './domain/services/ScheduleDomainService';

/**
 * Options for core module
 */
export type CoreModuleOptions = {
  modules: Type[];
  adapters: {
    routeRepository: Type<RouteRepository>;
    routeStopRepository: Type<RouteStopRepository>;
    scheduleRepository: Type<ScheduleRepository>;
  };
};

export const ROUTE_MANAGER_APPLICATION = 'ROUTE_MANAGER_APPLICATION';
export const ROUTE_DOMAIN_SERVICE = 'ROUTE_DOMAIN_SERVICE';
export const ROUTE_STOP_DOMAIN_SERVICE = 'ROUTE_STOP_DOMAIN_SERVICE';
export const SCHEDULE_DOMAIN_SERVICE = 'SCHEDULE_DOMAIN_SERVICE';

@Module({})
export class CoreModule {
  static register({ modules, adapters }: CoreModuleOptions): DynamicModule {
    const { routeRepository, routeStopRepository, scheduleRepository } =
      adapters;

    /*
     * Application manager providers
     */

    const RouteManagerApplicationProvider = {
      provide: ROUTE_MANAGER_APPLICATION,
      useFactory: (
        routeService: RouteService,
        routeStopService: RouteStopService,
        scheduleService: ScheduleService,
      ) => {
        return new RoutesManagerApplicationService(
          routeService,
          routeStopService,
          scheduleService,
        );
      },
      inject: [
        ROUTE_DOMAIN_SERVICE,
        ROUTE_STOP_DOMAIN_SERVICE,
        SCHEDULE_DOMAIN_SERVICE,
      ],
    };

    const RouteServiceProvider = {
      provide: ROUTE_DOMAIN_SERVICE,
      useFactory: (rep: RouteRepository) => {
        return new RouteDomainService(rep);
      },
      inject: [routeRepository],
    };

    const RouteStopServiceProvider = {
      provide: ROUTE_STOP_DOMAIN_SERVICE,
      useFactory: (rep: RouteStopRepository) => {
        return new RouteStopDomainService(rep);
      },
      inject: [routeStopRepository],
    };

    const ScheduleServiceProvider = {
      provide: SCHEDULE_DOMAIN_SERVICE,
      useFactory: (rep: ScheduleRepository) => {
        return new ScheduleDomainService(rep);
      },
      inject: [scheduleRepository],
    };

    return {
      module: CoreModule,
      global: true,
      imports: [...modules],
      providers: [
        RouteManagerApplicationProvider,
        RouteServiceProvider,
        RouteStopServiceProvider,
        ScheduleServiceProvider,
      ],
      exports: [ROUTE_MANAGER_APPLICATION],
    };
  }
}
