export interface CreateScheduleDTO {
  id?: string;
  routeId: string;
  daysOfWeek: number[];
  departureTimes: string[];
  frequencyMin?: number;
  validFrom: Date;
  validUntil?: Date;
  isHoliday: boolean;
}
