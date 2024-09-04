import GeneralError from "./GeneralError";

export default class NoForwardResponseError extends GeneralError {
  constructor(source?: any) {
    super('NO_FORWARD_RESPONSE_ERROR', undefined, source);
  }
}