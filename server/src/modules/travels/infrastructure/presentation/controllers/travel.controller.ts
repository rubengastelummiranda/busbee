import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Travel } from 'src/modules/travels/domain/schemas/Travel';
import { TRAVEL_SERVICE_CONTAINER } from 'src/modules/travels/travels.constants';
import { TravelResponse } from 'src/modules/travels/domain/types/TravelsResponse';

export interface TravelContainer {
  create(travel: Partial<Travel>): Promise<TravelResponse | Error>;

  findAll(): Promise<Travel[]>;

  update(id: string, travel: Partial<Travel>): Promise<TravelResponse | Error>;
  
  delete(id: string): Promise<void | Error>;
}

@Controller('travel')
export class TravelController {
  constructor(
    @Inject(TRAVEL_SERVICE_CONTAINER) private travelContainer: TravelContainer,
  ) {}
  //127.0.0.1:3000/travel/create verb= post();

  @Post('create')
  async createTravel(@Body() data: Partial<Travel>) {
    try {
      return this.travelContainer.create(data)
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error creating travel');
    }
  }
  //localHost:3000/travel/findall verb? get()
  @Get('findall')
  async findallTravels() {
    try {
      return this.travelContainer.findAll()
    } catch (e) {
      throw new InternalServerErrorException('Error creating travel');
    }
  }
  @Patch('update/:id')
  async update(@Param('id') id: string,@Body() data: Partial<Travel>): Promise<TravelResponse | Error>{
    return this.travelContainer.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id:string): Promise<void | Error>{
    return this.travelContainer.delete(id);
  }
}
