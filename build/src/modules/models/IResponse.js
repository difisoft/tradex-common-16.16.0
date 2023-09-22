"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFailResponse = exports.createSuccessResponse = void 0;
function createSuccessResponse(data) {
    return {
        data: data,
    };
}
exports.createSuccessResponse = createSuccessResponse;
function createFailResponse(code, messageParams, errors) {
    return {
        status: {
            code: code,
            messageParams: messageParams,
            params: errors,
        },
    };
}
exports.createFailResponse = createFailResponse;
//# sourceMappingURL=IResponse.js.map