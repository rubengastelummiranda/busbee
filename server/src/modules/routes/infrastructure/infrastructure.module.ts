import { Module } from '@nestjs/common';
import { PostgresDatabaseModule } from './persistence/postgres/postgres-database.module';
import { RouteController } from './presentation/http-server/controllers/route.controller';
import { RouteRepositoryAdapter } from './adapters/RouteRepositoryAdapter';
import { RouteStopRepositoryAdapter } from './adapters/RouteStopRepositoryAdapter';
import { ScheduleRepositoryAdapter } from './adapters/ScheduleRepositoryAdapter';

@Module({
  imports: [PostgresDatabaseModule],
  controllers: [RouteController],
  providers: [
    RouteRepositoryAdapter,
    RouteStopRepositoryAdapter,
    ScheduleRepositoryAdapter,
  ],
  exports: [
    RouteRepositoryAdapter,
    RouteStopRepositoryAdapter,
    ScheduleRepositoryAdapter,
  ],
})
export class InfrastructureModule {}
