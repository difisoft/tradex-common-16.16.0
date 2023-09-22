import GeneralError from './GeneralError';

export const ALREADY_EXISTED_ERROR = 'ALREADY_EXISTED_ERROR';

export default class AlreadyExistedError extends GeneralError {
  constructor(source?: any) {
    super(ALREADY_EXISTED_ERROR, undefined, source);
  }
}