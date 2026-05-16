export class RouteApplicationError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RouteApplicationError.prototype);
  }
}
