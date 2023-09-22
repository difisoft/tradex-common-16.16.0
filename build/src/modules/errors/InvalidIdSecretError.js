"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralError_1 = require("./GeneralError");
class InvalidIdSecretError extends GeneralError_1.default {
    constructor(source) {
        super('INVALID_ID_SECRET', undefined, source);
    }
}
exports.default = InvalidIdSecretError;
//# sourceMappingURL=InvalidIdSecretError.js.map