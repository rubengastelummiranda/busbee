import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CoreModule } from './core/core.module';
import { RouteRepositoryAdapter } from './infrastructure/adapters/RouteRepositoryAdapter';
import { RouteStopRepositoryAdapter } from './infrastructure/adapters/RouteStopRepositoryAdapter';
import { ScheduleRepositoryAdapter } from './infrastructure/adapters/ScheduleRepositoryAdapter';

@Module({
  imports: [
    InfrastructureModule,
    CoreModule.register({
      modules: [InfrastructureModule],
      adapters: {
        routeRepository: RouteRepositoryAdapter,
        routeStopRepository: RouteStopRepositoryAdapter,
        scheduleRepository: ScheduleRepositoryAdapter,
      },
    }),
  ],
})
export class RoutesModule {}
