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

export type UpdateScheduleDTO = Partial<Omit<CreateScheduleDTO, 'id'>>;
