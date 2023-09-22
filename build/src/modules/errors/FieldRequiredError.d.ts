import InvalidParameterError from "./InvalidParameterError";
export default class FieldRequiredError extends InvalidParameterError {
    constructor(fieldName: any);
}
