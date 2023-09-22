import GeneralError from "./GeneralError";

export default class InvalidParameterError extends GeneralError {
  constructor(params: any = []) {
    super('INVALID_PARAMETER', params);
  }

  public add = (code: any, fieldName: any, messageParams: any) => {
    this.params.push({
      code: code,
      param: fieldName,
      messageParams: messageParams,
    });
    return this;
  };

  public adds = (params: any) => {
    this.params = this.params.concat(params);
    return this;
  };

  public throwErr = () => {
    if (this.params != null && this.params.length > 0) {
      throw this;
    }
  };
}