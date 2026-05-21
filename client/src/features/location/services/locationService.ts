import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ActiveBus {
  routeId: string;
  vehicleId: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface LocationServiceEvents {
  onLocationsUpdate?: (locations: ActiveBus[]) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onConnectError?: (error: Error) => void;
}

class LocationService {
  private socket: Socket | null = null;
  private listeners = new Set<LocationServiceEvents>();

  subscribe(events: LocationServiceEvents): () => void {
    this.listeners.add(events);

    // If socket isn't connected yet, connect it
    if (!this.socket) {
      this.connect();
    } else if (this.socket.connected && events.onConnect) {
      // If already connected, notify this listener immediately
      events.onConnect();
    }

    // Return unsubscribe callback
    return () => {
      this.listeners.delete(events);
      // Auto-disconnect when there are no more active subscribers to save server resources
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    };
  }

  connect(): Socket {
    if (this.socket) {
      return this.socket;
    }

    console.log(`Connecting to WebSocket server at ${API_BASE_URL} via WebSocket transport...`);
    
    // Force websocket transport to bypass sticky session/CORS issues on cloud platform deployments
    this.socket = io(API_BASE_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to location WebSocket server');
      this.listeners.forEach((l) => l.onConnect?.());
    });

    this.socket.on('locations-update', (data: ActiveBus[]) => {
      this.listeners.forEach((l) => l.onLocationsUpdate?.(data));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.listeners.forEach((l) => l.onConnectError?.(error));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from location WebSocket server:', reason);
      this.listeners.forEach((l) => l.onDisconnect?.(reason));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting from location WebSocket server...');
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
    } else {
      console.warn('Cannot report location: WebSocket socket not connected');
    }
  }

  goOffline(driverId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('go-offline', { driverId });
    }
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }
}

export const locationService = new LocationService();
export default locationService;

