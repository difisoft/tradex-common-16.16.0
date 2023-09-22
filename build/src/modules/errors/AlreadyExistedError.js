"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALREADY_EXISTED_ERROR = void 0;
const GeneralError_1 = require("./GeneralError");
exports.ALREADY_EXISTED_ERROR = 'ALREADY_EXISTED_ERROR';
class AlreadyExistedError extends GeneralError_1.default {
    constructor(source) {
        super(exports.ALREADY_EXISTED_ERROR, undefined, source);
    }
}
exports.default = AlreadyExistedError;
//# sourceMappingURL=AlreadyExistedError.js.map