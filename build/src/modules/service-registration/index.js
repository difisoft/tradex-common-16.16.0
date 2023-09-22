"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInterval = exports.defaultTopic = exports.ServiceRegistration = exports.getInstance = exports.create = exports.SendRegistration = void 0;
const SendRegistration_1 = require("./SendRegistration");
exports.SendRegistration = SendRegistration_1.default;
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return SendRegistration_1.create; } });
Object.defineProperty(exports, "defaultInterval", { enumerable: true, get: function () { return SendRegistration_1.defaultInterval; } });
Object.defineProperty(exports, "defaultTopic", { enumerable: true, get: function () { return SendRegistration_1.defaultTopic; } });
Object.defineProperty(exports, "getInstance", { enumerable: true, get: function () { return SendRegistration_1.getInstance; } });
const ServiceRegistration_1 = require("./ServiceRegistration");
exports.ServiceRegistration = ServiceRegistration_1.default;
//# sourceMappingURL=index.js.map