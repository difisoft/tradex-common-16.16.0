"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFromStatus = void 0;
class GeneralError extends Error {
    constructor(code = 'INTERNAL_SERVER_ERROR', params = null, source, messageParams) {
        super();
        this.toStatus = () => {
            return {
                code: this.code,
                params: this.params,
                messageParams: this.messageParams,
            };
        };
        this.code = code;
        this.messageParams = messageParams;
        this.source = source;
        this.params = params;
        this.isSystemError = true;
    }
}
exports.default = GeneralError;
function createFromStatus(status) {
    return new GeneralError(status.code, status.params, null, status.messageParams);
}
exports.createFromStatus = createFromStatus;
//# sourceMappingURL=GeneralError.js.map