import GeneralError from "./GeneralError";
export declare const TOKEN_EXPIRED_ERROR_CODE = "TOKEN_EXPIRED";
export default class TokenExpiredError extends GeneralError {
    constructor(source?: any);
}
