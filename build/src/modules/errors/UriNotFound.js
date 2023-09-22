"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralError_1 = require("./GeneralError");
class UriNotFound extends GeneralError_1.default {
    constructor(source) {
        super('URI_NOT_FOUND', undefined, source);
    }
}
exports.default = UriNotFound;
//# sourceMappingURL=UriNotFound.js.map