"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.MessageHandler = void 0;
const log_1 = require("../log");
const SendRequest_1 = require("./SendRequest");
const UriNotFound_1 = require("../errors/UriNotFound");
const IResponse_1 = require("../models/IResponse");
const __1 = require("../..");
const NoForwardResponseError_1 = require("../errors/NoForwardResponseError");
class MessageHandler {
    constructor(sendRequest = null, timeoutinMs) {
        this.sendRequest = sendRequest;
        this.activeRequestMap = {};
        this.requestId = new Date().getTime();
        this.getActiveMessage = (msgId) => {
            return this.activeRequestMap[msgId];
        };
        this.handle = (message, func) => {
            if (message.value == null) {
                return;
            }
            const msgString = message.value.toString();
            try {
                const startTime = process.hrtime();
                let diff = null;
                __1.Logger.info(`receive msg: ${msgString}`);
                const msg = JSON.parse(msgString);
                if (msg.t != null && this.timeoutinMs != null && new Date().getTime() - msg.t > this.timeoutinMs) {
                    __1.Logger.warn(`ignore ${msg.uri} ${msg.transactionId} - ${msg.messageId} since it's time out`);
                    return;
                }
                if (msg.et != null && new Date().getTime() > msg.et) {
                    __1.Logger.warn(`ignore ${msg.uri} ${msg.transactionId} - ${msg.messageId} since it's time out`);
                    return;
                }
                const shouldResponse = this.shouldResponse(msg);
                if (shouldResponse && msg.uri === "/healthcheck") {
                    this.sendRequest.sendResponse(msg.transactionId, msg.messageId, msg.responseDestination.topic, msg.responseDestination.uri, {
                        status: "ON",
                    });
                }
                this.requestId += 1;
                msg.msgHandlerUniqueId = `${msg.transactionId}_${msg.messageId}_${this.requestId}`;
                this.activeRequestMap[msg.msgHandlerUniqueId] = msg;
                const obs = func(msg, message);
                if (obs === false) {
                    if (shouldResponse) {
                        diff = process.hrtime(startTime);
                        __1.Logger.info(`process request ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
                        this.sendRequest.sendResponse(msg.transactionId, msg.messageId, msg.responseDestination.topic, msg.responseDestination.uri, this.getErrorMessage(new UriNotFound_1.default()));
                    }
                    delete this.activeRequestMap[msg.msgHandlerUniqueId];
                    return;
                }
                else if (obs === true) {
                    diff = process.hrtime(startTime);
                    __1.Logger.info(`forward request ${msg.transactionId} ${msg.messageId} ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
                    delete this.activeRequestMap[msg.msgHandlerUniqueId];
                    return;
                }
                else {
                    const handleError = (err) => {
                        log_1.logger.logError(`error while processing request ${msg.transactionId} ${msg.messageId} ${msg.uri}`, err);
                        delete this.activeRequestMap[msg.msgHandlerUniqueId];
                        if (err instanceof NoForwardResponseError_1.default) {
                            return;
                        }
                        if (shouldResponse) {
                            this.sendRequest.sendResponse(msg.transactionId, msg.messageId, msg.responseDestination.topic, msg.responseDestination.uri, this.getErrorMessage(err));
                        }
                        diff = process.hrtime(startTime);
                        __1.Logger.info(`handle request ${msg.transactionId} ${msg.messageId} ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
                    };
                    const handleData = (data) => {
                        delete this.activeRequestMap[msg.msgHandlerUniqueId];
                        try {
                            if (shouldResponse) {
                                this.sendRequest.sendResponse(msg.transactionId, msg.messageId, msg.responseDestination.topic, msg.responseDestination.uri, { data: data });
                            }
                            diff = process.hrtime(startTime);
                            __1.Logger.info(`handle request ${msg.uri} took ${diff[0]}.${diff[1]} seconds`);
                        }
                        catch (err) {
                            handleError(err);
                        }
                    };
                    if (obs instanceof Promise) {
                        obs.then(handleData).catch(handleError);
                    }
                    else {
                        obs.subscribe(handleData, handleError);
                    }
                }
            }
            catch (e) {
                log_1.logger.logError(`error while processing message ${message.topic} ${message.value} ${msgString}`, e);
            }
        };
        this.getErrorMessage = (error) => {
            return getErrorMessage(error);
        };
        if (this.sendRequest == null) {
            this.sendRequest = SendRequest_1.getInstance();
        }
        this.timeoutinMs = timeoutinMs;
        if (this.timeoutinMs == null && process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT != null && process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT !== '') {
            try {
                this.timeoutinMs = parseInt(process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT, 10);
            }
            catch (e) {
                __1.Logger.error("wrong timeout setting", process.env.TRADEX_ENV_DEFAULT_REQUEST_TIMEOUT);
            }
        }
    }
    shouldResponse(msg) {
        return msg.responseDestination && msg.responseDestination.topic;
    }
}
exports.MessageHandler = MessageHandler;
function getErrorMessage(error) {
    if (error['isSystemError']) {
        if (error['source']) {
            log_1.logger.logError('error', error['source']);
        }
        else {
            log_1.logger.logError('error', error);
        }
        return IResponse_1.createFailResponse(error.code, error.messageParams, (error.params && error.params.length > 0) ? error.params : undefined);
    }
    else if (error['isForwardError']) {
        return { status: error.status };
    }
    else {
        log_1.logger.logError('error', error);
        return IResponse_1.createFailResponse('INTERNAL_SERVER_ERROR');
    }
}
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=MessageHandler.js.map