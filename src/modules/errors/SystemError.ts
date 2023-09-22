import GeneralError from "./GeneralError";

export default class SystemError extends GeneralError {
  constructor(source?: any) {
    super('INTERNAL_SERVER_ERROR', undefined, source);
  }
}