import GeneralError from "./GeneralError";

export const TOKEN_EXPIRED_ERROR_CODE = 'TOKEN_EXPIRED';

export default class TokenExpiredError extends GeneralError {
  constructor(source?: any) {
    super(TOKEN_EXPIRED_ERROR_CODE, undefined, source);
  }
}