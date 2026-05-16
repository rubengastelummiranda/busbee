import { Module } from '@nestjs/common';
import { TravelsModule } from './modules/travels/travels.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { GlobalConfigModule } from './config/global.config.module';
import { ConfigModule } from '@nestjs/config';
import { RoutesModule } from './modules/routes/routes.module';

@Module({
  imports: [TravelsModule,RoutesModule,  VehiclesModule, GlobalConfigModule,ConfigModule.forRoot({isGlobal:true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
