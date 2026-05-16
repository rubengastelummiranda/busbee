import { RouteType } from '../types/route-type.enum';
import { RouteStatus } from '../types/route-status.enum';

export interface CreateRouteDTO {
  id?: string;
  code: string;
  name: string;
  shortName?: string;
  type: RouteType;
  status: RouteStatus;
  color: string;
  icon?: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  polyline: string;
  boundingBox?: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
}

export type UpdateRouteDTO = Partial<CreateRouteDTO>;
