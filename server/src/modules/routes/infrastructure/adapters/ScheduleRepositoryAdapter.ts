import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from '../persistence/postgres/entities/Schedule.entity';
import { ScheduleRepository } from '../../core/domain/ports/outbound/ScheduleRepository';
import { Schedule } from '../../core/domain/schemas/Schedule';
import { UpdateScheduleDTO } from '../../core/domain/dtos/UpdateSchedule.dto';
import { RouteId } from '../../core/domain/shared/value-objects/route/RouteId';
import { DaysOfWeek } from '../../core/domain/shared/value-objects/schedule/DaysOfWeek';
import { DepartureTimes } from '../../core/domain/shared/value-objects/schedule/DepartureTimes';
import { FrequencyMin } from '../../core/domain/shared/value-objects/schedule/FrequencyMin';
import { ScheduleDate } from '../../core/domain/shared/value-objects/schedule/ScheduleDate';

@Injectable()
export class ScheduleRepositoryAdapter implements ScheduleRepository {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  async findById(id: string): Promise<Schedule | null> {
    const entity = await this.scheduleRepo.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRouteId(routeId: string): Promise<Schedule[]> {
    const entities = await this.scheduleRepo.findBy({ routeId });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(schedule: Schedule): Promise<void> {
    await this.scheduleRepo.save(schedule.toPrimitives());
  }

  async update(id: string, schedule: UpdateScheduleDTO): Promise<Schedule> {
    const existing = await this.scheduleRepo.findOneBy({ id });
    if (!existing) {
      throw new Error('Schedule not found');
    }

    // Directamente inyectamos el DTO de actualización porque ahora son datos primitivos
    await this.scheduleRepo.update({ id }, schedule);

    const updatedData = await this.scheduleRepo.findOneBy({ id });
    return this.toDomain(updatedData!);
  }

  async delete(id: string): Promise<void> {
    await this.scheduleRepo.delete(id);
  }

  private toDomain(entity: ScheduleEntity): Schedule {
    return Schedule.create({
      id: entity.id,
      routeId: RouteId.create(entity.routeId),
      daysOfWeek: DaysOfWeek.create(entity.daysOfWeek),
      departureTimes: DepartureTimes.create(entity.departureTimes),
      frequencyMin:
        entity.frequencyMin !== null && entity.frequencyMin !== undefined
          ? FrequencyMin.create(entity.frequencyMin)
          : undefined,
      validFrom: ScheduleDate.create(entity.validFrom),
      validUntil: entity.validUntil
        ? ScheduleDate.create(entity.validUntil)
        : undefined,
      isHoliday: entity.isHoliday,
    });
  }
}
