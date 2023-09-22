"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralError_1 = require("./GeneralError");
class InvalidParameterError extends GeneralError_1.default {
    constructor(params = []) {
        super('INVALID_PARAMETER', params);
        this.add = (code, fieldName, messageParams) => {
            this.params.push({
                code: code,
                param: fieldName,
                messageParams: messageParams,
            });
            return this;
        };
        this.adds = (params) => {
            this.params = this.params.concat(params);
            return this;
        };
        this.throwErr = () => {
            if (this.params != null && this.params.length > 0) {
                throw this;
            }
        };
    }
}
exports.default = InvalidParameterError;
//# sourceMappingURL=InvalidParameterError.js.map