"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.create = exports.defaultTopic = exports.defaultInterval = void 0;
const ServiceRegistration_1 = require("./ServiceRegistration");
exports.defaultInterval = 300000;
exports.defaultTopic = "service.register";
class SendRegistration {
    constructor(send, conf) {
        this.send = send;
        const interval = conf.interval ? conf.interval : exports.defaultInterval;
        this.topic = conf.listeningTopic ? conf.listeningTopic : exports.defaultTopic;
        this.serviceRegistration = new ServiceRegistration_1.default(conf.serviceName, conf.nodeId, 0);
        setInterval(() => this.doRegister(), interval);
    }
    doRegister() {
        this.serviceRegistration.currentTime = new Date().getTime();
        this.send.sendMessage("", this.topic, "", this.serviceRegistration);
    }
}
exports.default = SendRegistration;
let instance = null;
function create(send, conf) {
    instance = new SendRegistration(send, conf);
}
exports.create = create;
function getInstance() {
    return instance;
}
exports.getInstance = getInstance;
//# sourceMappingURL=SendRegistration.js.map