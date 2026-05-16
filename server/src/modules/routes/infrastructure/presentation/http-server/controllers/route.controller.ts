import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ProductCreatorFilter } from '../exception-filter/exception-filter';
import { RouteApplication } from 'src/modules/routes/core/application/ports/inbound/RouteApplication';
import { CreateRouteDTO } from 'src/modules/routes/core/domain/dtos/CreateRoute.dto';
import { ROUTE_MANAGER_APPLICATION } from 'src/modules/routes/core/core.module';

@Controller('route')
@UseFilters(ProductCreatorFilter)
export class ControllersController {
  constructor(
    @Inject(ROUTE_MANAGER_APPLICATION) private app: RouteApplication,
  ) {}

  @Post('create')
  async createRoute(@Body() routeData: CreateRouteDTO) {
    const response = await this.app.createRoute(routeData);
    Logger.log(`Route created with ID: ${response.toPrimitives().id}`);
    return {
      success: true,
      data: response,
    };
  }
}
