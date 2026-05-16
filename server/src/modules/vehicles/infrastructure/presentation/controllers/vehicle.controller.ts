import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
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
  @Patch('edit/:id')
  async edit(@Param('id') id: string, @Body() data: Partial<Vehicle>): Promise<VehicleResponse | Error>{
    return this.vehicleServiceContainer.editVehicle(id,data);
  }
  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<void | Error>{
    return this.vehicleServiceContainer.deleteVehicle(id);
  }
}