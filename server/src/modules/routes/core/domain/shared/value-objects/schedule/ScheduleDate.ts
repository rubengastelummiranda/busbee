export class ScheduleDate {
  private constructor(public readonly value: Date) {}

  public static create(date: Date | string): ScheduleDate {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid schedule date format');
    }

    return new ScheduleDate(parsedDate);
  }
}
