import GeneralError from "./GeneralError";
export declare const OBJECT_NOT_FOUND_ERROR_CODE = "OBJECT_NOT_FOUND";
export default class ObjectNotFoundError extends GeneralError {
    constructor(source?: any);
}
