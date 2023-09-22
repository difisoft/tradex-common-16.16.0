import InvalidParameterError from "./InvalidParameterError";

export default class InvalidFieldValueError extends InvalidParameterError {
  constructor(fieldName: any, fieldValue: any) {
    super([{
      code: 'INVALID_FIELD_VALUE',
      param: fieldName,
      messageParams: [fieldName, fieldValue]
    }]);
  }
}