import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEntity } from './entities/Route.entity';
import { RouteStopEntity } from './entities/RouteStop.entity';
import { ScheduleEntity } from './entities/Schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteEntity, RouteStopEntity, ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class PostgresDatabaseModule {}
