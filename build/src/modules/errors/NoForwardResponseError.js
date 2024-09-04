"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralError_1 = require("./GeneralError");
class NoForwardResponseError extends GeneralError_1.default {
    constructor(source) {
        super('NO_FORWARD_RESPONSE_ERROR', undefined, source);
    }
}
exports.default = NoForwardResponseError;
//# sourceMappingURL=NoForwardResponseError.js.map