"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STREAM_STATE = exports.PromiseState = exports.SEND_MESSAGE_TYPE = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["MESSAGE"] = "MESSAGE";
    MessageType["REQUEST"] = "REQUEST";
    MessageType["RESPONSE"] = "RESPONSE";
})(MessageType || (MessageType = {}));
exports.MessageType = MessageType;
const SEND_MESSAGE_TYPE = {
    OBSERVABLE: 0,
    PROMISE: 1,
};
exports.SEND_MESSAGE_TYPE = SEND_MESSAGE_TYPE;
class PromiseState {
    constructor() {
        this.prom = new Promise((resolve, reject) => {
            this.rs = resolve;
            this.rj = reject;
        });
    }
    resolve(v) {
        this.rs(v);
    }
    reject(err) {
        this.rj(err);
    }
    promise() {
        return this.prom;
    }
}
exports.PromiseState = PromiseState;
const STREAM_STATE = {
    NORMAL: "NORMAL",
    FINSISH: "FINSISH",
    ERROR: "ERROR",
};
exports.STREAM_STATE = STREAM_STATE;
//# sourceMappingURL=types.js.map