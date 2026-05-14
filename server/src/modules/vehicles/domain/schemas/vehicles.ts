/**
 * Esquema de Vehicle que representa un camión dentro del sistema.
 *
 * Esta clase contiene las propiedades principales del vehículo usadas
 * en la capa de dominio para operaciones relacionadas con vehículos.
 */
import { VehicleStatus } from '../types/vehicles-status.enum';

export class Vehicle {
  /** Identificador único del vehículo. */
  id: string;

  /** Número de placa único del vehículo. */
  plateNumber: string;

  /** Identificador único del dispositivo GPS tracker. */
  deviceId: string;

  /** Capacidad de pasajeros del vehículo. */
  capacity: number;

  /** Identificador opcional de la ruta actual asignada. */
  currentRouteId?: string;

  /** Última latitud registrada por el GPS. */
  lastLat?: number;

  /** Última longitud registrada por el GPS. */
  lastLng?: number;

  /** Último ángulo de dirección registrado (0-360 grados). */
  lastHeading?: number;

  /** Última velocidad registrada. */
  lastSpeed?: number;

  /** Fecha y hora de la última señal del GPS. */
  lastSeenAt?: Date;

  /** Estado actual del vehículo. */
  status: VehicleStatus;

  private constructor(data: Partial<Vehicle> = {}) {
    this.id = data.id ?? '';
    this.plateNumber = data.plateNumber ?? '';
    this.deviceId = data.deviceId ?? '';
    this.capacity = data.capacity ?? 0;
    this.currentRouteId = data.currentRouteId;
    this.lastLat = data.lastLat;
    this.lastLng = data.lastLng;
    this.lastHeading = data.lastHeading;
    this.lastSpeed = data.lastSpeed;
    this.lastSeenAt = data.lastSeenAt;
    this.status = data.status ?? VehicleStatus.OFFLINE;
  }

  /**
   * Crea una nueva instancia de Vehicle usando valores por defecto
   * cuando no se proporcionan en los datos.
   */
  static create(data: Partial<Vehicle> = {}): Vehicle {
    return new Vehicle(data);
  }

  /**
   * Convierte la instancia de dominio en un objeto primitivo plano.
   */
  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      plateNumber: this.plateNumber,
      deviceId: this.deviceId,
      capacity: this.capacity,
      currentRouteId: this.currentRouteId,
      lastLat: this.lastLat,
      lastLng: this.lastLng,
      lastHeading: this.lastHeading,
      lastSpeed: this.lastSpeed,
      lastSeenAt: this.lastSeenAt?.toISOString(),
      status: this.status,
    };
  }
}