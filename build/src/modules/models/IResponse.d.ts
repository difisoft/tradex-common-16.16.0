import IStatus from "./IStatus";
import IParamError from "./IParamError";
export default interface IResponse {
    status?: IStatus;
    data?: any;
}
declare function createSuccessResponse(data: any): IResponse;
declare function createFailResponse(code: string, messageParams?: string[], errors?: IParamError[]): IResponse;
export { createSuccessResponse, createFailResponse, };
