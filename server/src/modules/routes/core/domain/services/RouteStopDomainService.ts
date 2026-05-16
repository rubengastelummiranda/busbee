import { RouteStopService } from '../ports/inbound/RouteStopService';
import { RouteStopRepository } from '../ports/outbound/RouteStopRepository';
import { RouteStop } from '../schemas/RouteStop';
import { CreateRouteStopDTO } from '../dtos/CreateRouteStop.dto';
import { UpdateRouteStopDTO } from '../dtos/UpdateRouteStop.dto';
import { RouteId } from '../shared/value-objects/route/RouteId';
import { StopId } from '../shared/value-objects/route-stop/StopId';
import { StopSequence } from '../shared/value-objects/route-stop/StopSequence';
import { DistanceFromStartKm } from '../shared/value-objects/route-stop/DistanceFromStartKm';
import { EstimatedMinFromStart } from '../shared/value-objects/route-stop/EstimatedMinFromStart';
import { DwellTimeSec } from '../shared/value-objects/route-stop/DwellTimeSec';

export class RouteStopDomainService implements RouteStopService {
  constructor(private routeStopRepository: RouteStopRepository) {}

  async createRouteStop(routeStopData: CreateRouteStopDTO): Promise<RouteStop> {
    const newRouteStop = RouteStop.create({
      id: routeStopData.id,
      routeId: RouteId.create(routeStopData.routeId),
      stopId: StopId.create(routeStopData.stopId),
      sequence: StopSequence.create(routeStopData.sequence),
      distanceFromStartKm: DistanceFromStartKm.create(
        routeStopData.distanceFromStartKm,
      ),
      estimatedMinFromStart: EstimatedMinFromStart.create(
        routeStopData.estimatedMinFromStart,
      ),
      dwellTimeSec: DwellTimeSec.create(routeStopData.dwellTimeSec),
      isTerminal: routeStopData.isTerminal,
      isTimepoint: routeStopData.isTimepoint,
      onDemand: routeStopData.onDemand,
    });
    await this.routeStopRepository.save(newRouteStop);
    return newRouteStop;
  }

  async getRouteStopById(routeStopId: string): Promise<RouteStop | null> {
    return this.routeStopRepository.findById(routeStopId);
  }

  async updateRouteStop(
    routeStopId: string,
    updateData: UpdateRouteStopDTO,
  ): Promise<RouteStop> {
    const existing = await this.routeStopRepository.findById(routeStopId);
    if (!existing) {
      throw new Error('RouteStop not found');
    }
    const res = await this.routeStopRepository.update(routeStopId, updateData);
    return res;
  }

  async deleteRouteStop(routeStopId: string): Promise<void> {
    await this.routeStopRepository.delete(routeStopId);
  }

  async addRouteStopToRoute(
    routeId: string,
    routeStopData: CreateRouteStopDTO,
  ): Promise<RouteStop> {
    const existingStops = await this.routeStopRepository.findByRouteId(routeId);

    const newStop = RouteStop.create({
      id: routeStopData.id,
      routeId: RouteId.create(routeStopData.routeId),
      stopId: StopId.create(routeStopData.stopId),
      sequence: StopSequence.create(routeStopData.sequence),
      distanceFromStartKm: DistanceFromStartKm.create(
        routeStopData.distanceFromStartKm,
      ),
      estimatedMinFromStart: EstimatedMinFromStart.create(
        routeStopData.estimatedMinFromStart,
      ),
      dwellTimeSec: DwellTimeSec.create(routeStopData.dwellTimeSec),
      isTerminal: routeStopData.isTerminal,
      isTimepoint: routeStopData.isTimepoint,
      onDemand: routeStopData.onDemand,
    });
    const combinedStops = [...existingStops, newStop];

    // Validar lógicas de dominio puras
    this.validateContiguousSequence(combinedStops);

    // Guardar nuevo
    await this.routeStopRepository.save(newStop);
    return newStop;
  }

  async removeRouteStopFromRoute(
    routeId: string,
    routeStopId: string,
  ): Promise<void> {
    const existingStops = await this.routeStopRepository.findByRouteId(routeId);
    const stopsRemaining = existingStops.filter(
      (s) => s.id.value !== routeStopId,
    );

    if (stopsRemaining.length > 0) {
      // this.validateContiguousSequence(stopsRemaining); // Si hay huecos tal vez haga falta reindexar
    }

    await this.routeStopRepository.delete(routeStopId);
  }

  /**
   * Regla de negocio: Asegurar que la secuencia de paradas de una ruta (1, 2, 3...) no tenga huecos ni duplicados.
   */
  private validateContiguousSequence(stops: RouteStop[]): void {
    if (stops.length === 0) return;

    const sequences = stops.map((s) => s.sequence.value).sort((a, b) => a - b);

    // Iniciar siempre desde 1 si se requiere
    if (sequences[0] !== 1) {
      throw new Error('Stop sequence must start at 1.');
    }

    for (let i = 0; i < sequences.length; i++) {
      if (sequences[i] !== i + 1) {
        throw new Error(
          `Invalid stop sequence. Missing or duplicate sequence at position ${i + 1}`,
        );
      }
    }
  }

  /**
   * Regla de negocio: Solo puede haber un Terminal de INICIO y un Terminal de FIN
   */
  public validateTerminals(stops: RouteStop[], isCircular: boolean): void {
    const terminals = stops.filter((s) => s.isTerminal);

    if (isCircular && terminals.length !== 1) {
      throw new Error(
        'A circular route must have exactly 1 terminal stop (start/end).',
      );
    }

    if (!isCircular && terminals.length !== 2) {
      throw new Error(
        'A linear/express route must have exactly 2 terminal stops (origin and destination).',
      );
    }
  }
}
