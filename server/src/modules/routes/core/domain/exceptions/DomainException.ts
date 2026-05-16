export class RouteDomainError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RouteDomainError.prototype);
  }
}
