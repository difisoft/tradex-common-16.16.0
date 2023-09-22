"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = exports.getInstance = exports.create = exports.SendRequestCommon = exports.SendRequest = void 0;
const tslib_1 = require("tslib");
const StreamHandler_1 = require("./StreamHandler");
const log_1 = require("../log");
const types_1 = require("./types");
const errors_1 = require("../errors");
const GeneralError_1 = require("../errors/GeneralError");
const State_1 = require("../utils/State");
const Rx = require("rx");
const Kafka = require("node-rdkafka");
const mstime_1 = require("../utils/mstime");
const LOW_PRODUCER_READY = "LOW_PRODUCER_READY";
const HIGH_PRODUCER_READY = "HIGH_PRODUCER_READY";
const LOW_PRODUCER_CONNECT = "LOW_PRODUCER_CONNECT";
const HIGH_PRODUCER_CONNECT = "HIGH_PRODUCER_CONNECT";
const CONSUMER = "CONSUMER";
class SendRequestCommon {
    constructor(conf, handleSendError, producerOptions, topicOptions, readyCallback, moreReadyStateFields) {
        this.conf = conf;
        this.handleSendError = handleSendError;
        this.messageId = 0;
        this.bufferedMessages = [];
        this.highLatencyBufferedMessages = [];
        this.isReady = false;
        this.isHighLatencyReady = false;
        this.reallySendMessage = (message) => {
            this.doReallySendMessage(message);
        };
        if (readyCallback != null) {
            let fields = [HIGH_PRODUCER_READY, LOW_PRODUCER_READY, LOW_PRODUCER_CONNECT, HIGH_PRODUCER_CONNECT];
            if (moreReadyStateFields != null) {
                fields = fields.concat(moreReadyStateFields);
            }
            this.readyState = new State_1.default(fields, true, () => false);
            this.readyState.subscribeCompleted().subscribe(readyCallback);
        }
        this.responseTopic = `${this.conf.clusterId}.response.${this.conf.clientId}`;
        const ops = Object.assign({
            "client.id": conf.clientId,
            "metadata.broker.list": this.conf.kafkaUrls.join(),
            "retry.backoff.ms": 200,
            "message.send.max.retries": 10,
            "batch.num.messages": 5,
            "message.max.bytes": 1000000000,
            "fetch.message.max.bytes": 1000000000
        }, producerOptions);
        const topicOps = topicOptions ? topicOptions : {};
        this.producer = new Kafka.Producer(ops, topicOps);
        this.producer.connect({
            topic: "",
            allTopics: true,
            timeout: 30000
        }, () => {
            log_1.logger.info("low latency producer connect");
            if (this.readyState != null) {
                this.readyState.setState(LOW_PRODUCER_CONNECT, true);
            }
        });
        this.producer.on("ready", () => {
            log_1.logger.info("low latency producer ready", this.readyState);
            this.isReady = true;
            if (this.readyState != null) {
                this.readyState.setState(LOW_PRODUCER_READY, true);
            }
            this.bufferedMessages.forEach(this.reallySendMessage);
        });
        this.producer.on("event.error", (err) => {
            log_1.logger.logError("producer error", err);
        });
        const highLatencyOps = Object.assign({
            "client.id": conf.clientId,
            "metadata.broker.list": this.conf.kafkaUrls.join(),
            "retry.backoff.ms": 200,
            "message.send.max.retries": 10,
            "message.max.bytes": 1000000000,
            "fetch.message.max.bytes": 1000000000
        }, producerOptions);
        this.highLatencyProducer = new Kafka.Producer(highLatencyOps, topicOps);
        this.highLatencyProducer.connect({
            topic: "",
            allTopics: true,
            timeout: 30000
        }, () => {
            log_1.logger.info("producer connect");
            if (this.readyState != null) {
                this.readyState.setState(HIGH_PRODUCER_CONNECT, true);
            }
        });
        this.highLatencyProducer.on("ready", () => {
            log_1.logger.info("high latency producer ready", this.readyState);
            this.isHighLatencyReady = true;
            if (this.readyState != null) {
                this.readyState.setState(HIGH_PRODUCER_READY, true);
            }
            this.highLatencyBufferedMessages.forEach(this.reallySendMessage);
        });
        this.highLatencyProducer.on("event.error", (err) => {
            log_1.logger.logError("producer error", err);
        });
    }
    getResponseTopic() {
        return this.responseTopic;
    }
    sendMessage(transactionId, topic, uri, data, highLatency = true) {
        const message = this.createMessage(transactionId, topic, uri, data);
        message.highLatency = highLatency;
        this.sendMessageCheckReady(message, highLatency);
    }
    ;
    sendRaw(topic, data, highLatency = true) {
        const message = {
            raw: true,
            message: data,
            topic: topic,
            highLatency: highLatency,
        };
        this.sendMessageCheckReady(message, highLatency);
    }
    ;
    sendForwardMessage(originMessage, newTopic, newUri) {
        const message = {
            topic: newTopic,
            message: originMessage
        };
        message.message.uri = newUri;
        this.sendMessageCheckReady(message, false);
    }
    ;
    sendResponse(transactionId, messageId, topic, uri, data) {
        const message = this.createMessage(transactionId, topic, uri, data, types_1.MessageType.RESPONSE, undefined, undefined, messageId);
        this.sendMessageCheckReady(message, false);
    }
    ;
    sendMessageCheckReady(message, highLatency) {
        if (highLatency) {
            if (!this.isHighLatencyReady) {
                this.highLatencyBufferedMessages.push(message);
                return;
            }
        }
        else {
            if (!this.isReady) {
                this.bufferedMessages.push(message);
                return;
            }
        }
        this.reallySendMessage(message);
    }
    timeout(message) {
    }
    doReallySendMessage(message) {
        try {
            const msgContent = JSON.stringify(message.message);
            if (message.highLatency === true) {
                log_1.logger.info(`send message ${msgContent} to topic ${message.topic}`);
                this.highLatencyProducer.produce(message.topic, null, new Buffer(msgContent), null, Date.now());
            }
            else {
                log_1.logger.info(`send low latency message ${msgContent} to topic ${message.topic}`);
                this.producer.produce(message.topic, null, new Buffer(msgContent), null, Date.now());
            }
            if (message.timeout) {
                setTimeout(() => this.timeout(message), message.timeout);
            }
        }
        catch (e) {
            if (!this.handleSendError || !this.handleSendError(e)) {
                if (e.message.indexOf("Local: Queue full") > -1) {
                    log_1.logger.logError("error while sending the message. exitting...", e);
                    process.exit(1);
                }
                else {
                    log_1.logger.logError("error while sending the message", e);
                }
            }
        }
    }
    getMessageId() {
        this.messageId++;
        return `${this.messageId}`;
    }
    createMessage(transactionId, topic, uri, data, messageType = types_1.MessageType.MESSAGE, responseTopic, responseUri, messageId, timeout) {
        return {
            topic: topic,
            message: {
                messageType: messageType,
                sourceId: this.conf.clusterId,
                messageId: messageId ? messageId : this.getMessageId(),
                transactionId: transactionId,
                uri: uri,
                responseDestination: responseTopic ? {
                    topic: responseTopic,
                    uri: responseUri
                }
                    :
                        undefined,
                data: data,
                t: timeout != null ? undefined : new Date().getTime(),
                et: timeout == null ? undefined : new Date().getTime() + timeout,
            }
        };
    }
    ;
}
exports.SendRequestCommon = SendRequestCommon;
class SendRequest extends SendRequestCommon {
    constructor(conf, consumerOptions, initListener = true, topicConf = {}, handleSendError, producerOptions, readyCallback, expiredIn) {
        super(conf, handleSendError, producerOptions, topicConf, readyCallback, initListener ? [CONSUMER] : null);
        this.requestedMessages = new Map();
        this.expiredIn = 0;
        this.reallySendMessage = (message) => {
            if (message.subject) {
                this.requestedMessages.set(message.message.messageId, message);
            }
            super.doReallySendMessage(message);
        };
        this.expiredIn = expiredIn ? expiredIn : 10000;
        if (initListener) {
            log_1.logger.info(`init response listener ${this.responseTopic}`);
            const topicOps = Object.assign(Object.assign({}, topicConf), { "auto.offset.reset": "earliest" });
            new StreamHandler_1.StreamHandler(this.conf, consumerOptions, [this.responseTopic], (data) => this.handlerResponse(data), topicOps, () => {
                if (this.readyState != null) {
                    log_1.logger.info("response consumer ready", this.readyState);
                    this.readyState.setState(CONSUMER, true);
                }
            });
        }
    }
    sendRequestAsync(transactionId, topic, uri, data, timeout) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promise = new types_1.PromiseState();
            this.sendRequestBase(transactionId, topic, uri, data, promise, types_1.SEND_MESSAGE_TYPE.PROMISE, timeout);
            return promise.promise();
        });
    }
    ;
    sendRequest(transactionId, topic, uri, data, timeout) {
        const subject = new Rx.Subject();
        this.sendRequestBase(transactionId, topic, uri, data, subject, types_1.SEND_MESSAGE_TYPE.OBSERVABLE, timeout);
        return subject;
    }
    ;
    sendRequestBase(transactionId, topic, uri, data, subject, sendType, timeout) {
        const message = this.createMessage(transactionId, topic, uri, data, types_1.MessageType.REQUEST, this.responseTopic, "REQUEST_RESPONSE", null, timeout);
        message.subject = subject;
        message.timeout = timeout;
        message.sendType = sendType;
        if (!this.isReady) {
            this.bufferedMessages.push(message);
        }
        else {
            this.reallySendMessage(message);
        }
    }
    ;
    timeout(message) {
        const msgId = message.message.messageId;
        if (this.requestedMessages.has(msgId)) {
            this.respondError(message, new errors_1.TimeoutError());
            this.requestedMessages.delete(msgId);
        }
    }
    respondData(message, data) {
        if (message.subject == null) {
            return;
        }
        if (message.sendType === types_1.SEND_MESSAGE_TYPE.PROMISE) {
            (message.subject).resolve(data);
        }
        else {
            (message.subject).onNext(data);
            (message.subject).onCompleted();
        }
    }
    respondError(message, err) {
        if (message.subject == null) {
            return;
        }
        if (message.sendType === types_1.SEND_MESSAGE_TYPE.PROMISE) {
            (message.subject).reject(err);
        }
        else {
            (message.subject).onError(err);
        }
    }
    handlerResponse(message) {
        const msgStr = message.value.toString();
        try {
            if (message.timestamp != null && message.timestamp > 0 && this.expiredIn > 0 && mstime_1.diffMsTime(message.timestamp) > this.expiredIn) {
                log_1.logger.warn("ignore this request since it's expired %s", msgStr);
                return;
            }
        }
        catch (e) {
            log_1.logger.error("fail to handle message time", e);
        }
        const msg = JSON.parse(msgStr);
        const data = this.requestedMessages.get(msg.messageId);
        if (data != null) {
            this.respondData(data, msg);
            this.requestedMessages.delete(msg.messageId);
        }
        else {
            log_1.logger.warn(`cannot find where to response (probably timeout happen) "${msgStr}"`);
        }
    }
}
exports.SendRequest = SendRequest;
let instance = null;
function create(conf, consumerOptions, initResponseListener = true, topicConf = {}, producerOptions = {}, readyCallback) {
    instance = new SendRequest(conf, consumerOptions, initResponseListener, topicConf, null, producerOptions, readyCallback);
}
exports.create = create;
function getInstance() {
    return instance;
}
exports.getInstance = getInstance;
function getResponse(msg) {
    if (msg.data != null) {
        const response = msg.data;
        if (response.status != null) {
            throw errors_1.createFromStatus(response.status);
        }
        else {
            return response.data;
        }
    }
    else {
        log_1.logger.error("no data in response of message", msg);
        throw new GeneralError_1.default();
    }
}
exports.getResponse = getResponse;
//# sourceMappingURL=SendRequest.js.map