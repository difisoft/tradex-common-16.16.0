import IStatus from "../models/IStatus";

export class ForwardError extends Error {
  public status: IStatus;
  public isForwardError: boolean;

  constructor(status: IStatus) {
    super();
    this.status = status;
    this.isForwardError = true;
  }
}