import { Module, Provider } from '@nestjs/common';
import { VehicleController } from './infrastructure/presentation/controllers/vehicle.controller';
import { VehicleRepository } from './domain/repositories/vehicles.repository';
import { VehicleDomainService } from './services/vehicleDomainService';
import type { VehicleService } from './services/vehicle.service';
import { VehicleServiceContainer } from './infrastructure/presentation/VehicleServiceContainer';
import {
  VEHICLE_REPOSITORY_PROVIDER,
  VEHICLE_SERVICE_CONTAINER,
  VEHICLE_SERVICE_PROVIDER,
} from './vehicles.constants';
import { PostgresVehicleRepository } from './infrastructure/postgres/repositories/postgres.vehicle.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './infrastructure/postgres/entities/vehicle.entities';

export const vehicleRepositoryProvider: Provider = {
  provide: VEHICLE_REPOSITORY_PROVIDER,
  useClass: PostgresVehicleRepository,
};

export const vehicleServiceProvider: Provider = {
  provide: VEHICLE_SERVICE_PROVIDER,
  useFactory: (repository: VehicleRepository) => {
    return new VehicleDomainService(repository);
  },
  inject: [VEHICLE_REPOSITORY_PROVIDER],
};

export const vehicleServiceContainer: Provider = {
  provide: VEHICLE_SERVICE_CONTAINER,
  useFactory: (service: VehicleService) => {
    return new VehicleServiceContainer(service);
  },
  inject: [VEHICLE_SERVICE_PROVIDER],
};

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  controllers: [VehicleController],
  providers: [vehicleRepositoryProvider, vehicleServiceProvider, vehicleServiceContainer],
})
export class VehiclesModule {}