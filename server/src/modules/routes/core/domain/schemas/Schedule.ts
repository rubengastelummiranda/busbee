import { ScheduleId } from '../shared/value-objects/schedule/ScheduleId';
import { RouteId } from '../shared/value-objects/route/RouteId';
import { DaysOfWeek } from '../shared/value-objects/schedule/DaysOfWeek';
import { DepartureTimes } from '../shared/value-objects/schedule/DepartureTimes';
import { FrequencyMin } from '../shared/value-objects/schedule/FrequencyMin';
import { ScheduleDate } from '../shared/value-objects/schedule/ScheduleDate';

interface ScheduleProps {
  id: ScheduleId;
  routeId: RouteId;
  daysOfWeek: DaysOfWeek;
  departureTimes: DepartureTimes;
  frequencyMin?: FrequencyMin;
  validFrom: ScheduleDate;
  validUntil?: ScheduleDate;
  isHoliday: boolean;
}

export class Schedule {
  public readonly id: ScheduleId;
  public readonly routeId: RouteId;

  public daysOfWeek: DaysOfWeek;
  public departureTimes: DepartureTimes;
  public frequencyMin?: FrequencyMin;

  public validFrom: ScheduleDate;
  public validUntil?: ScheduleDate;
  public isHoliday: boolean;

  private constructor(props: ScheduleProps) {
    this.id = props.id;
    this.routeId = props.routeId;
    this.daysOfWeek = props.daysOfWeek;
    this.departureTimes = props.departureTimes;
    this.frequencyMin = props.frequencyMin;
    this.validFrom = props.validFrom;
    this.validUntil = props.validUntil;
    this.isHoliday = props.isHoliday;
  }

  public static create(
    props: Omit<ScheduleProps, 'id'> & { id?: string },
  ): Schedule {
    const scheduleId = props.id
      ? ScheduleId.create(props.id)
      : ScheduleId.generate();

    // validUntil no puede ser previo a validFrom si es que existe
    if (props.validUntil && props.validUntil.value < props.validFrom.value) {
      throw new Error(
        'The validUntil date cannot be prior to the validFrom date.',
      );
    }

    return new Schedule({
      ...props,
      id: scheduleId,
    });
  }

  public toPrimitives() {
    return {
      id: this.id.value,
      routeId: this.routeId.value,
      daysOfWeek: this.daysOfWeek.value,
      departureTimes: this.departureTimes.value,
      frequencyMin: this.frequencyMin?.value,
      validFrom: this.validFrom.value.toISOString(),
      validUntil: this.validUntil?.value.toISOString(),
      isHoliday: this.isHoliday,
    };
  }
}
