"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralError_1 = require("./GeneralError");
class SystemError extends GeneralError_1.default {
    constructor(source) {
        super('INTERNAL_SERVER_ERROR', undefined, source);
    }
}
exports.default = SystemError;
//# sourceMappingURL=SystemError.js.map