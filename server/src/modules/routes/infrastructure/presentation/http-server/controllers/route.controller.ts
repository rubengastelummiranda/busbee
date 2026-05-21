import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ProductCreatorFilter } from '../exception-filter/exception-filter';
import { RouteApplication } from 'src/modules/routes/core/application/ports/inbound/RouteApplication';
import { CreateRouteDTO } from 'src/modules/routes/core/domain/dtos/CreateRoute.dto';
import { UpdateRouteDTO } from 'src/modules/routes/core/domain/dtos/UpdateRoute.dto';
import { CreateRouteStopDTO } from 'src/modules/routes/core/domain/dtos/CreateRouteStop.dto';
import { CreateScheduleDTO } from 'src/modules/routes/core/domain/dtos/CreateSchedule.dto';
import { ROUTE_MANAGER_APPLICATION } from 'src/modules/routes/core/core.module';

@Controller('route')
@UseFilters(ProductCreatorFilter)
export class RouteController {
  constructor(
    @Inject(ROUTE_MANAGER_APPLICATION) private app: RouteApplication,
  ) {}

  @Post('create')
  async createRoute(@Body() routeData: CreateRouteDTO) {
    const response = await this.app.createRoute(routeData);
    Logger.log(`Route created with ID: ${response.toPrimitives().id}`);
    return response.toPrimitives();
  }

  @Get('findall')
  async findAllRoutes() {
    const response = await this.app.findAllRoutes();
    return response.map((route) => route.toPrimitives());
  }

  @Get(':id')
  async getRouteById(@Param('id') id: string) {
    const response = await this.app.getRouteById(id);
    if (!response) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return response.toPrimitives();
  }

  @Patch('update/:id')
  async updateRoute(
    @Param('id') id: string,
    @Body() updateData: UpdateRouteDTO,
  ) {
    const response = await this.app.updateRoute(id, updateData);
    return response.toPrimitives();
  }

  @Delete('delete/:id')
  async deleteRoute(@Param('id') id: string) {
    await this.app.deleteRoute(id);
    return {
      success: true,
      message: `Route with ID ${id} deleted successfully`,
    };
  }

  @Post(':id/stop')
  async addNewStopToRoute(
    @Param('id') routeId: string,
    @Body() stopData: CreateRouteStopDTO,
  ) {
    await this.app.addNewStopToRoute(routeId, stopData);
    return {
      success: true,
      message: `Stop added successfully to Route with ID ${routeId}`,
    };
  }

  @Delete(':routeId/stop/:stopId')
  async removeStopFromRoute(
    @Param('routeId') routeId: string,
    @Param('stopId') stopId: string,
  ) {
    await this.app.removeStopFromRoute(routeId, stopId);
    return {
      success: true,
      message: `Stop with ID ${stopId} removed successfully from Route with ID ${routeId}`,
    };
  }

  @Post(':id/schedule')
  async addScheduleToRoute(
    @Param('id') routeId: string,
    @Body() scheduleData: CreateScheduleDTO,
  ) {
    await this.app.addScheduleToRoute(routeId, scheduleData);
    return {
      success: true,
      message: `Schedule assigned successfully to Route with ID ${routeId}`,
    };
  }

  @Delete(':routeId/schedule/:scheduleId')
  async removeScheduleFromRoute(
    @Param('routeId') routeId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    await this.app.removeScheduleFromRoute(routeId, scheduleId);
    return {
      success: true,
      message: `Schedule with ID ${scheduleId} unassigned successfully from Route with ID ${routeId}`,
    };
  }
}
