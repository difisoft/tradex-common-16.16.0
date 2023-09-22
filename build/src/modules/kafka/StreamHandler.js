"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBroadcastListener = exports.StreamHandler = void 0;
const node_rdkafka_1 = require("node-rdkafka");
const log_1 = require("../log");
class StreamHandler {
    constructor(conf, options, topics, dataHandler, topicConf = {}, readyCallback) {
        const ops = Object.assign({
            'group.id': conf.clusterId,
            'metadata.broker.list': conf.kafkaUrls.join(),
        }, options);
        this.hasError = false;
        this.stream = node_rdkafka_1.createReadStream(ops, topicConf, {
            topics: topics
        });
        if (readyCallback) {
            this.stream.consumer.on('ready', readyCallback);
        }
        this.stream.on('error', (err) => {
            log_1.logger.error('error on kafka', topics, err);
            this.hasError = true;
            setTimeout(() => {
                if (this.hasError) {
                    log_1.logger.logError('error flag still on. preparing to exit in 2 seconds', topics);
                    setTimeout(() => process.exit(1), 2000);
                }
            }, 15000);
        });
        this.stream.on('data', (data) => {
            this.hasError = false;
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