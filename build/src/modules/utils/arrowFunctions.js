"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSafe = void 0;
const SystemError_1 = require("../errors/SystemError");
const doSafe = (observable, func) => {
    try {
        func();
    }
    catch (e) {
        observable.onError(new SystemError_1.default(e));
        observable.onCompleted();
    }
};
exports.doSafe = doSafe;
//# sourceMappingURL=arrowFunctions.js.map