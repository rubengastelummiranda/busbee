export interface CreateRouteStopDTO {
  id?: string;
  routeId: string;
  stopId: string;
  sequence: number;
  distanceFromStartKm: number;
  estimatedMinFromStart: number;
  dwellTimeSec: number;
  isTerminal: boolean;
  isTimepoint: boolean;
  onDemand: boolean;
}

export type UpdateRouteStopDTO = Partial<Omit<CreateRouteStopDTO, 'id'>>;
