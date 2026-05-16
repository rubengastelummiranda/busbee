import { RouteStopId } from '../shared/value-objects/route-stop/RouteStopId';
import { RouteId } from '../shared/value-objects/route/RouteId';
import { StopId } from '../shared/value-objects/route-stop/StopId';
import { StopSequence } from '../shared/value-objects/route-stop/StopSequence';
import { DistanceFromStartKm } from '../shared/value-objects/route-stop/DistanceFromStartKm';
import { EstimatedMinFromStart } from '../shared/value-objects/route-stop/EstimatedMinFromStart';
import { DwellTimeSec } from '../shared/value-objects/route-stop/DwellTimeSec';

interface RouteStopProps {
  id: RouteStopId;
  routeId: RouteId;
  stopId: StopId;
  sequence: StopSequence;
  distanceFromStartKm: DistanceFromStartKm;
  estimatedMinFromStart: EstimatedMinFromStart;
  dwellTimeSec: DwellTimeSec;
  isTerminal: boolean;
  isTimepoint: boolean;
  onDemand: boolean;
}

export class RouteStop {
  // IDENTIFICACIÓN
  public readonly id: RouteStopId;
  public readonly routeId: RouteId;
  public readonly stopId: StopId;

  // ORDEN Y TIEMPO
  public sequence: StopSequence;
  public distanceFromStartKm: DistanceFromStartKm;
  public estimatedMinFromStart: EstimatedMinFromStart;
  public dwellTimeSec: DwellTimeSec;

  // FLAGS
  public isTerminal: boolean;
  public isTimepoint: boolean;
  public onDemand: boolean;

  private constructor(props: RouteStopProps) {
    this.id = props.id;
    this.routeId = props.routeId;
    this.stopId = props.stopId;
    this.sequence = props.sequence;
    this.distanceFromStartKm = props.distanceFromStartKm;
    this.estimatedMinFromStart = props.estimatedMinFromStart;
    this.dwellTimeSec = props.dwellTimeSec;
    this.isTerminal = props.isTerminal;
    this.isTimepoint = props.isTimepoint;
    this.onDemand = props.onDemand;
  }

  public static create(
    props: Omit<RouteStopProps, 'id'> & { id?: string },
  ): RouteStop {
    const routeStopId = props.id
      ? RouteStopId.create(props.id)
      : RouteStopId.generate();

    return new RouteStop({
      ...props,
      id: routeStopId,
    });
  }

  public toPrimitives() {
    return {
      id: this.id.value,
      routeId: this.routeId.value,
      stopId: this.stopId.value,
      sequence: this.sequence.value,
      distanceFromStartKm: this.distanceFromStartKm.value,
      estimatedMinFromStart: this.estimatedMinFromStart.value,
      dwellTimeSec: this.dwellTimeSec.value,
      isTerminal: this.isTerminal,
      isTimepoint: this.isTimepoint,
      onDemand: this.onDemand,
    };
  }
}
