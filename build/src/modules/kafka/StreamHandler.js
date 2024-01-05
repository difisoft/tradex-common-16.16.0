"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBroadcastListener = exports.StreamHandler = void 0;
const node_rdkafka_1 = require("node-rdkafka");
const log_1 = require("../log");
const util_1 = require("util");
class StreamHandler {
    constructor(conf, options, topics, dataHandler, topicConf = {}, readyCallback) {
        const ops = Object.assign({
            'group.id': conf.clusterId,
            'metadata.broker.list': conf.kafkaUrls.join(),
        }, options);
        this.stream = node_rdkafka_1.createReadStream(ops, topicConf, {
            topics: topics
        });
        this.stream.consumer.on('ready', () => {
            if (readyCallback != null) {
                readyCallback();
            }
        });
        this.stream.on('error', (err) => {
            if (!(err.code != null && util_1.isNumber(err.code) && err.code > 0)) {
                log_1.logger.error('a fatal error on kafka consumer', topics, 'code:', err.code, 'isFatal: ', err.isFatal, 'retriable: ', err.isRetriable, 'origin: ', err.origin, err);
            }
            else {
                log_1.logger.warn('an error on kafka consunmer', topics, err.message, 'code:', err.code, 'isFatal: ', err.isFatal, 'retriable: ', err.isRetriable, 'origin: ', err.origin);
            }
        });
        this.stream.on('data', (data) => {
            dataHandler(data, this);
        });
        this.stream.on('throttle', (data) => {
            log_1.logger.warn("kafka throttle happens", data);
        });
    }
    close() {
        this.stream.close();
    }
}
exports.StreamHandler = StreamHandler;
function createBroadcastListener(conf, options, topics, dataHandler, topicConf = {}) {
    const opt = Object.assign({
        'group.id': conf.clientId,
    }, options);
    return new StreamHandler(conf, opt, topics, dataHandler, topicConf);
}
exports.createBroadcastListener = createBroadcastListener;
//# sourceMappingURL=StreamHandler.js.map