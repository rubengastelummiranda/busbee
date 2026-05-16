import { ScheduleService } from '../ports/inbound/ScheduleService';
import { ScheduleRepository } from '../ports/outbound/ScheduleRepository';
import { Schedule } from '../schemas/Schedule';
import { CreateScheduleDTO } from '../dtos/CreateSchedule.dto';
import { UpdateScheduleDTO } from '../dtos/UpdateSchedule.dto';
import { RouteId } from '../shared/value-objects/route/RouteId';
import { DaysOfWeek } from '../shared/value-objects/schedule/DaysOfWeek';
import { DepartureTimes } from '../shared/value-objects/schedule/DepartureTimes';
import { FrequencyMin } from '../shared/value-objects/schedule/FrequencyMin';
import { ScheduleDate } from '../shared/value-objects/schedule/ScheduleDate';

export class ScheduleDomainService implements ScheduleService {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async createSchedule(scheduleData: CreateScheduleDTO): Promise<Schedule> {
    const newSchedule = Schedule.create({
      id: scheduleData.id,
      routeId: RouteId.create(scheduleData.routeId),
      daysOfWeek: DaysOfWeek.create(scheduleData.daysOfWeek),
      departureTimes: DepartureTimes.create(scheduleData.departureTimes),
      frequencyMin:
        scheduleData.frequencyMin !== undefined
          ? FrequencyMin.create(scheduleData.frequencyMin)
          : undefined,
      validFrom: ScheduleDate.create(scheduleData.validFrom),
      validUntil: scheduleData.validUntil
        ? ScheduleDate.create(scheduleData.validUntil)
        : undefined,
      isHoliday: scheduleData.isHoliday,
    });
    await this.scheduleRepository.save(newSchedule);
    return newSchedule;
  }

  async getScheduleById(scheduleId: string): Promise<Schedule | null> {
    return this.scheduleRepository.findById(scheduleId);
  }

  async updateSchedule(
    scheduleId: string,
    updateData: UpdateScheduleDTO,
  ): Promise<Schedule> {
    const existing = await this.scheduleRepository.findById(scheduleId);
    if (!existing) throw new Error('Schedule not found');

    const updatedSchedule = await this.scheduleRepository.update(
      scheduleId,
      updateData,
    );
    return updatedSchedule;
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    await this.scheduleRepository.delete(scheduleId);
  }

  async assignScheduleToRoute(
    routeId: string,
    scheduleData: CreateScheduleDTO,
  ): Promise<Schedule> {
    const existingSchedulesForRoute =
      await this.scheduleRepository.findByRouteId(routeId);

    const newSchedule = Schedule.create({
      id: scheduleData.id,
      routeId: RouteId.create(routeId),
      daysOfWeek: DaysOfWeek.create(scheduleData.daysOfWeek),
      departureTimes: DepartureTimes.create(scheduleData.departureTimes),
      frequencyMin:
        scheduleData.frequencyMin !== undefined
          ? FrequencyMin.create(scheduleData.frequencyMin)
          : undefined,
      validFrom: ScheduleDate.create(scheduleData.validFrom),
      validUntil: scheduleData.validUntil
        ? ScheduleDate.create(scheduleData.validUntil)
        : undefined,
      isHoliday: scheduleData.isHoliday,
    });

    // Aplicar lógica de dominio principal: chequear el solapamiento de fechas
    this.checkForDateOverlaps(newSchedule, existingSchedulesForRoute);

    await this.scheduleRepository.save(newSchedule);
    return newSchedule;
  }

  async unassignScheduleFromRoute(
    routeId: string,
    scheduleId: string,
  ): Promise<void> {
    await this.scheduleRepository.delete(scheduleId);
  }

  /**
   * Regla de negocio: Asegurar que una nueva programación no tenga superposiciones críticas
   * de fechas operativas para una misma ruta, previniendo solapamiento de calendarios.
   */
  private checkForDateOverlaps(
    newSchedule: Schedule,
    existingSchedules: Schedule[],
  ): void {
    const newStart = newSchedule.validFrom.value.getTime();
    const newEnd = newSchedule.validUntil
      ? newSchedule.validUntil.value.getTime()
      : Infinity;

    for (const schedule of existingSchedules) {
      if (schedule.id.value === newSchedule.id.value) continue;

      const existingStart = schedule.validFrom.value.getTime();
      const existingEnd = schedule.validUntil
        ? schedule.validUntil.value.getTime()
        : Infinity;

      const overlaps = newStart <= existingEnd && newEnd >= existingStart;

      if (overlaps) {
        const sharedDays = newSchedule.daysOfWeek.value.filter((day) =>
          schedule.daysOfWeek.value.includes(day),
        );

        if (sharedDays.length > 0) {
          throw new Error(
            'The new schedule overlaps in dates and operating days with an existing schedule for this route.',
          );
        }
      }
    }
  }
}
