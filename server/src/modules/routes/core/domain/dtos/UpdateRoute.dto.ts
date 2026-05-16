import { RouteType } from '../shared/types/route-type.enum';
import { RouteStatus } from '../shared/types/route-status.enum';

export interface UpdateRouteDTO {
  code?: string;
  name?: string;
  shortName?: string;
  type?: RouteType;
  status?: RouteStatus;
  color?: string;
  icon?: string;
  totalDistanceKm?: number;
  estimatedDurationMin?: number;
  polyline?: string;
  boundingBox?: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
}
