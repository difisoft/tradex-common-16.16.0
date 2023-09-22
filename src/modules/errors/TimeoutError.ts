export class TimeoutError extends Error {
  public isTimeoutError: boolean;

  constructor() {
    super();
    this.isTimeoutError = true;
  }
}