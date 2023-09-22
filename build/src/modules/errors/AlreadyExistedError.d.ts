import GeneralError from './GeneralError';
export declare const ALREADY_EXISTED_ERROR = "ALREADY_EXISTED_ERROR";
export default class AlreadyExistedError extends GeneralError {
    constructor(source?: any);
}
