export class DaysOfWeek {
  private constructor(public readonly value: number[]) {}

  public static create(days: number[]): DaysOfWeek {
    if (!Array.isArray(days) || days.length === 0) {
      throw new Error('Days of week cannot be empty array');
    }

    const uniqueDays = [...new Set(days)];

    // Asumiendo que 1 = Lunes, 7 = Domingo (o depende de tu convención, aquí validamos del 1 al 7 o 0 al 6)
    // Vamos a validar de 0 (Domingo) a 6 (Sábado) que es el estándar de JavaScript / Date.getDay()
    if (uniqueDays.some((d) => d < 0 || d > 6 || !Number.isInteger(d))) {
      throw new Error('Days of week must be unique integers between 0 and 6');
    }

    return new DaysOfWeek(uniqueDays.sort((a, b) => a - b));
  }
}
