export interface UpdateScheduleDTO {
  routeId?: string;
  daysOfWeek?: number[];
  departureTimes?: string[];
  frequencyMin?: number;
  validFrom?: Date;
  validUntil?: Date;
  isHoliday?: boolean;
}
