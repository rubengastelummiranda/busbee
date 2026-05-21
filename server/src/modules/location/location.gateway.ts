import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface ActiveLocation {
  routeId: string;
  vehicleId: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server!: Server;

  private activeLocations = new Map<string, ActiveLocation>();
  private socketToDriverMap = new Map<string, string>(); // socket.id -> driverId

  afterInit(server: Server) {
    Logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`);
    // Immediately send the current list of active locations to the newly connected client
    const currentLocations = Array.from(this.activeLocations.values());
    client.emit('locations-update', currentLocations);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
    const driverId = this.socketToDriverMap.get(client.id);
    if (driverId) {
      Logger.log(`Driver ${driverId} disconnected. Removing from active tracking.`);
      this.activeLocations.delete(driverId);
      this.socketToDriverMap.delete(client.id);
      this.broadcastActiveLocations();
    }
  }

  @SubscribeMessage('report-location')
  handleReportLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      driverId: string;
      routeId: string;
      vehicleId: string;
      lat: number;
      lng: number;
    },
  ) {
    const { driverId, routeId, vehicleId, lat, lng } = data;
    if (!driverId || !routeId || lat === undefined || lng === undefined) {
      return;
    }

    Logger.log(
      `Location report from driver ${driverId} for route ${routeId} / vehicle ${vehicleId}: [${lat}, ${lng}]`,
    );

    this.activeLocations.set(driverId, {
      routeId,
      vehicleId,
      lat,
      lng,
      updatedAt: new Date().toISOString(),
    });

    this.socketToDriverMap.set(client.id, driverId);
    this.broadcastActiveLocations();
  }

  @SubscribeMessage('go-offline')
  handleGoOffline(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string },
  ) {
    const { driverId } = data;
    if (!driverId) {
      return;
    }

    Logger.log(`Driver ${driverId} is going offline manually.`);
    this.activeLocations.delete(driverId);
    this.socketToDriverMap.delete(client.id);
    this.broadcastActiveLocations();
  }

  private broadcastActiveLocations() {
    const currentLocations = Array.from(this.activeLocations.values());
    this.server.emit('locations-update', currentLocations);
  }
}
