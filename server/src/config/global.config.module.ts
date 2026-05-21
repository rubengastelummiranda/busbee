import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TravelEntity } from 'src/modules/travels/infrastructure/postgres/entities/travel.entities';
import { VehicleEntity } from 'src/modules/vehicles/infrastructure/postgres/entities/vehicle.entities';
import { RouteEntity } from 'src/modules/routes/infrastructure/persistence/postgres/entities/Route.entity';
import { RouteStopEntity } from 'src/modules/routes/infrastructure/persistence/postgres/entities/RouteStop.entity';
import { ScheduleEntity } from 'src/modules/routes/infrastructure/persistence/postgres/entities/Schedule.entity';
import { UserEntity } from 'src/modules/auth/infrastructure/postgres/entities/user.entities';

@Module({
    imports:[TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService:ConfigService) => ({
          type: 'postgres',
          url: configService.get<string>('URL_DATABASE') || "Default Error URL",
          entities:[TravelEntity,VehicleEntity, RouteEntity, RouteStopEntity, ScheduleEntity, UserEntity],
          synchronize: true,
        }),
    })],
    // exports: databaseProviders,
})
export class GlobalConfigModule {}