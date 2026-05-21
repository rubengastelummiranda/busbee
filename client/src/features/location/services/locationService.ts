import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ActiveBus {
  routeId: string;
  vehicleId: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

class LocationService {
  private socket: Socket | null = null;

  connect(onLocationsUpdate: (locations: ActiveBus[]) => void): Socket {
    if (this.socket) {
      return this.socket;
    }

    // Connect to the main API base URL where the Socket.io gateway is hosted
    this.socket = io(API_BASE_URL);

    this.socket.on('connect', () => {
      console.log('Connected to location WebSocket server');
    });

    this.socket.on('locations-update', (data: ActiveBus[]) => {
      onLocationsUpdate(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from location WebSocket server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  reportLocation(data: {
    driverId: string;
    routeId: string;
    vehicleId: string;
    lat: number;
    lng: number;
  }) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('report-location', data);
    }
  }

  goOffline(driverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('go-offline', { driverId });
    }
  }
}

export const locationService = new LocationService();
export default locationService;
