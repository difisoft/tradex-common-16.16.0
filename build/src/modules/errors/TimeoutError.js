"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
class TimeoutError extends Error {
    constructor() {
        super();
        this.isTimeoutError = true;
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=TimeoutError.js.map