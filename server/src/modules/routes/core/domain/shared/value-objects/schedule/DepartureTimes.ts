export class DepartureTimes {
  private constructor(public readonly value: string[]) {}

  public static create(times: string[]): DepartureTimes {
    if (!Array.isArray(times)) {
      throw new Error('Departure times must be an array');
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato 24h: HH:mm

    if (times.some((t) => !timeRegex.test(t))) {
      throw new Error('Invalid time format. Use HH:mm');
    }

    // Ordenar tiempos de salida cronológicamente
    const sortedTimes = [...new Set(times)].sort();
    return new DepartureTimes(sortedTimes);
  }
}
