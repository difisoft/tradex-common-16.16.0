import { IAccessToken, IToken } from "../models";
declare const generateToken: (length?: number, onlyDigit?: boolean) => string;
declare function undefinedOr<T>(data: T): T;
declare function convertToken(token: IAccessToken): IToken;
export { generateToken, convertToken, undefinedOr };
