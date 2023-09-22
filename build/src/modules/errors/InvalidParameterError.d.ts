import GeneralError from "./GeneralError";
export default class InvalidParameterError extends GeneralError {
    constructor(params?: any);
    add: (code: any, fieldName: any, messageParams: any) => this;
    adds: (params: any) => this;
    throwErr: () => void;
}
