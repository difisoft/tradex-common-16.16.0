import IStatus from "./IStatus";
import IParamError from "./IParamError";

export default interface IResponse {
  status?: IStatus,
  data?: any,
}

function createSuccessResponse(data: any): IResponse {
  return {
    data: data,
  };
}

// noinspection JSAnnotator
function createFailResponse(code: string, messageParams?: string[], errors?: IParamError[]): IResponse {
  return {
    status: {
      code: code,
      messageParams: messageParams,
      params: errors,
    },
  };
}

export {
  createSuccessResponse,
  createFailResponse,
}