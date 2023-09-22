"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRED_ERROR_CODE = void 0;
const GeneralError_1 = require("./GeneralError");
exports.TOKEN_EXPIRED_ERROR_CODE = 'TOKEN_EXPIRED';
class TokenExpiredError extends GeneralError_1.default {
    constructor(source) {
        super(exports.TOKEN_EXPIRED_ERROR_CODE, undefined, source);
    }
}
exports.default = TokenExpiredError;
//# sourceMappingURL=TokenExpiredError.js.map