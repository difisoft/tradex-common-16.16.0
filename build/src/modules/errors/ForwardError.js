"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForwardError = void 0;
class ForwardError extends Error {
    constructor(status) {
        super();
        this.status = status;
        this.isForwardError = true;
    }
}
exports.ForwardError = ForwardError;
//# sourceMappingURL=ForwardError.js.map