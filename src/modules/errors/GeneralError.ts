import { IStatus } from '../models';

export default class GeneralError extends Error {
  public code: any;
  public messageParams: any;
  public source: any;
  public params: any;
  public isSystemError: boolean;

  constructor(code: string='INTERNAL_SERVER_ERROR', params: any[]=null, source?: any, messageParams?: any) {
    super();
    this.code = code;
    this.messageParams = messageParams;
    this.source = source;
    this.params = params;
    this.isSystemError = true;
  }

  public toStatus: () => IStatus = () => {
    return {
      code: this.code,
      params: this.params,
      messageParams: this.messageParams,
    };
  }
}

function createFromStatus(status: IStatus): GeneralError {
  return new GeneralError(status.code, status.params, null, status.messageParams);
}

export {
  createFromStatus,
}
