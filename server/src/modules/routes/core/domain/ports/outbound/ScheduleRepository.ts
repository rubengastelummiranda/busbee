import { Schedule } from '../../schemas/Schedule';
import { UpdateScheduleDTO } from '../../dtos/UpdateSchedule.dto';

export interface ScheduleRepository {
  findById(id: string): Promise<Schedule | null>;
  findByRouteId(routeId: string): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
  update(id: string, schedule: UpdateScheduleDTO): Promise<Schedule>;
  delete(id: string): Promise<void>;
}
