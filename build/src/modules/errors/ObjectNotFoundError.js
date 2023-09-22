"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBJECT_NOT_FOUND_ERROR_CODE = void 0;
const GeneralError_1 = require("./GeneralError");
exports.OBJECT_NOT_FOUND_ERROR_CODE = 'OBJECT_NOT_FOUND';
class ObjectNotFoundError extends GeneralError_1.default {
    constructor(source) {
        super(exports.OBJECT_NOT_FOUND_ERROR_CODE, undefined, source);
    }
}
exports.default = ObjectNotFoundError;
//# sourceMappingURL=ObjectNotFoundError.js.map