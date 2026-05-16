import { RouteType } from '../shared/types/route-type.enum';
import { RouteStatus } from '../shared/types/route-status.enum';
import { RouteId } from '../shared/value-objects/route/RouteId';
import { RouteCode } from '../shared/value-objects/route/RouteCode';
import { RouteColor } from '../shared/value-objects/route/RouteColor';
import { RouteName } from '../shared/value-objects/route/RouteName';
import { RouteShortName } from '../shared/value-objects/route/RouteShortName';
import { RouteIcon } from '../shared/value-objects/route/RouteIcon';
import { DistanceKm } from '../shared/value-objects/route/DistanceKm';
import { DurationMin } from '../shared/value-objects/route/DurationMin';
import { BoundingBox } from '../shared/value-objects/route/BoundingBox';
import { EncodedPolyline } from '../shared/value-objects/route/EncodedPolyline';

export interface RouteProps {
  id: RouteId;
  code: RouteCode;
  name: RouteName;
  shortName?: RouteShortName;
  type: RouteType;
  status: RouteStatus;
  color: RouteColor;
  icon?: RouteIcon;
  totalDistanceKm: DistanceKm;
  estimatedDurationMin: DurationMin;
  polyline: EncodedPolyline;
  boundingBox?: BoundingBox;
}

export class Route {
  // IDENTIFICACIÓN
  public readonly id: RouteId;
  public code: RouteCode;
  public name: RouteName;
  public shortName?: RouteShortName;

  // CONFIGURACIÓN
  public type: RouteType;
  public status: RouteStatus;
  public color: RouteColor;
  public icon?: RouteIcon;
  public totalDistanceKm: DistanceKm;
  public estimatedDurationMin: DurationMin;

  // GEO
  public polyline: EncodedPolyline;
  public boundingBox?: BoundingBox;

  // RELACIONES
  // public stops: RouteStop[];
  // public schedules: Schedule[];
  // public trips: Travel[];
  // public vehicles: Vehicle[];

  private constructor(props: RouteProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.shortName = props.shortName;
    this.type = props.type;
    this.status = props.status;
    this.color = props.color;
    this.icon = props.icon;
    this.totalDistanceKm = props.totalDistanceKm;
    this.estimatedDurationMin = props.estimatedDurationMin;
    this.polyline = props.polyline;
    this.boundingBox = props.boundingBox;
  }

  public static create(props: Omit<RouteProps, 'id'> & { id?: string }): Route {
    const routeId = props.id ? RouteId.create(props.id) : RouteId.generate();

    return new Route({
      ...props,
      id: routeId,
    });
  }

  public toPrimitives() {
    return {
      id: this.id.value,
      code: this.code.value,
      name: this.name.value,
      shortName: this.shortName?.value,
      type: this.type,
      status: this.status,
      color: this.color.value,
      icon: this.icon?.value,
      totalDistanceKm: this.totalDistanceKm.value,
      estimatedDurationMin: this.estimatedDurationMin.value,
      polyline: this.polyline.value,
      boundingBox: this.boundingBox
        ? {
            ne: { lat: this.boundingBox.ne.lat, lng: this.boundingBox.ne.lng },
            sw: { lat: this.boundingBox.sw.lat, lng: this.boundingBox.sw.lng },
          }
        : undefined,
    };
  }
}
