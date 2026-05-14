import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TravelEntity } from 'src/modules/travels/infrastructure/postgres/entities/travel.entities';
import { VehicleEntity } from 'src/modules/vehicles/infrastructure/postgres/entities/vehicle.entities';

@Module({
    imports:[TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService:ConfigService) => ({
          type: 'postgres',
          url: configService.get<string>('URL_DATABASE') || "Default Error URL",
          entities:[TravelEntity,VehicleEntity],
          synchronize: true,
        }),
    })],
    // exports: databaseProviders,
})
export class GlobalConfigModule {}