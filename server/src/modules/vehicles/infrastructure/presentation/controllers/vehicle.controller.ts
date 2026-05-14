import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { VehicleServiceContainer } from '../VehicleServiceContainer';
import { Vehicle } from '../../../domain/schemas/vehicles';
import { VehicleResponse } from '../../../domain/types/VehicleResponse';
import { VEHICLE_SERVICE_CONTAINER } from '../../../vehicles.constants';

@Controller('vehicles')
export class VehicleController {
  constructor(
    @Inject(VEHICLE_SERVICE_CONTAINER)
    private readonly vehicleServiceContainer: VehicleServiceContainer,
  ) {}

  @Post('create')
  async create(@Body() data: Partial<Vehicle>): Promise<VehicleResponse | Error> {
    return this.vehicleServiceContainer.createVehicle(data);
  }

  @Get('findall')
  async findAll(): Promise<Vehicle[]> {
    return this.vehicleServiceContainer.listVehicles();
  }
}