import InvalidParameterError from "./InvalidParameterError";

export default class FieldRequiredError extends InvalidParameterError {
  constructor(fieldName: any) {
    super([{
      code: 'FIELD_IS_REQUIRED',
      param: fieldName,
      messageParams: [fieldName],
    }]);
  }
}