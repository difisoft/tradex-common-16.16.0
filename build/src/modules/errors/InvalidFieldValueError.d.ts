import InvalidParameterError from "./InvalidParameterError";
export default class InvalidFieldValueError extends InvalidParameterError {
    constructor(fieldName: any, fieldValue: any);
}
