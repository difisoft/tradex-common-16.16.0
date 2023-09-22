import GeneralError from "./GeneralError";

export default class UriNotFound extends GeneralError {
  constructor(source?: any) {
    super('URI_NOT_FOUND', undefined, source);
  }
}