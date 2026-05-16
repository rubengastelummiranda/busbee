export interface UpdateRouteStopDTO {
  routeId?: string;
  stopId?: string;
  sequence?: number;
  distanceFromStartKm?: number;
  estimatedMinFromStart?: number;
  dwellTimeSec?: number;
  isTerminal?: boolean;
  isTimepoint?: boolean;
  onDemand?: boolean;
}
