"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResult = exports.createFailResult = exports.ListenTopic = exports.CommonTest = exports.results = void 0;
const Kafka = require("./../modules/kafka");
const utils_1 = require("./../modules/utils");
const rx_1 = require("rx");
function createSuccessResult(name) {
    return {
        testName: name,
        success: true,
    };
}
exports.createSuccessResult = createSuccessResult;
function createFailResult(name, reason) {
    return {
        testName: name,
        success: false,
        reason: reason,
    };
}
exports.createFailResult = createFailResult;
exports.results = [];
class ListenTopic {
    constructor() {
        this.conditions = [];
        this.callbacks = [];
        this.handler = (data, streamHandler) => {
            this.streamHandler = streamHandler;
            const msg = data.value.toString();
            const message = JSON.parse(msg);
            for (let i = 0; i < this.conditions.length; i++) {
                if (this.conditions[i](message)) {
                    this.callbacks[i](message);
                }
            }
        };
    }
    when(condition, callback) {
        this.conditions.push(condition);
        this.callbacks.push(callback);
    }
    close() {
        this.streamHandler.close();
    }
}
exports.ListenTopic = ListenTopic;
class CommonTest {
    constructor(conf) {
        this.expectedResults = new Map();
        this.currentTransactionId = 0;
        this.baseNumber = new Date().getTime();
        this.testConfiguration = {
            clientId: 'testingClientId',
            clusterId: conf.clusterId,
            kafkaUrls: conf.kafkaUrls,
        };
        this.request = new Kafka.SendRequest(this.testConfiguration, {}, false);
    }
    listenTopic(topic) {
        const listeningTopic = topic ? topic : this.request.getResponseTopic();
        const listenTopic = new ListenTopic();
        new Kafka.StreamHandler(this.testConfiguration, {}, [listeningTopic], listenTopic.handler);
        return listenTopic;
    }
    listenTopics(topics) {
        const listenTopic = new ListenTopic();
        new Kafka.StreamHandler(this.testConfiguration, {}, topics, listenTopic.handler);
        return listenTopic;
    }
    sendMessage(topic, uri, data, tx) {
        const txId = tx ? tx : this.getNewTxId();
        this.request.sendMessage(txId, topic, uri, data);
        return txId;
    }
    sendRequest(topic, uri, data, tx) {
        const txId = tx ? tx : this.getNewTxId();
        this.request.sendRequest(txId, topic, uri, data);
        return txId;
    }
    sendResponse(msgId, topic, uri, data, tx) {
        const txId = tx ? tx : this.getNewTxId();
        this.request.sendResponse(txId, msgId, topic, uri, data);
        return txId;
    }
    runTests(instance, funcs, timeOut = 40000) {
        const length = funcs.length;
        let finishTotal = 0;
        const subject = new rx_1.Subject();
        funcs.forEach((func) => this.runTest(instance, func, timeOut).subscribe((data) => {
            subject.onNext(data);
            finishTotal++;
            if (finishTotal === length) {
                subject.onCompleted();
            }
        }, (err) => {
            subject.onNext(createFailResult(name, `encounter error ${JSON.stringify(err)}`));
            finishTotal++;
            if (finishTotal === length) {
                subject.onCompleted();
            }
        }));
        return subject;
    }
    runTest(instance, func, timeOut = 20000) {
        const subject = new rx_1.Subject();
        const txId = this.getNewTxId();
        const name = `${typeof instance}.${func.name}`;
        setTimeout(() => {
            if (this.expectedResults[txId]) {
                utils_1.default.onNext(subject, {
                    testName: name,
                    success: false,
                    reason: `timeout`,
                });
                delete this.expectedResults[txId];
            }
        }, timeOut);
        this.expectedResults[txId] = {
            txId: txId,
        };
        func(name, txId).subscribe((data) => {
            if (this.expectedResults[txId]) {
                utils_1.default.onNext(subject, data);
                delete this.expectedResults[txId];
            }
        }, (err) => {
            if (this.expectedResults[txId]) {
                utils_1.default.onNext(subject, createFailResult(name, `encounter error ${JSON.stringify(err)}`));
                delete this.expectedResults[txId];
            }
        });
        return subject;
    }
    getNewTxId() {
        this.currentTransactionId++;
        return `${this.baseNumber + this.currentTransactionId}`;
    }
    createResult(name, expectedResult, result, compare) {
        const res = {
            testName: name,
            success: false,
            reason: '',
        };
        if (expectedResult.errorType && (!result.errorType || result.errorType !== expectedResult.errorType)) {
            res.reason = `expected error type ${expectedResult.errorType} but got ${result.errorType}`;
        }
        else if (!expectedResult.errorType && result.errorType) {
            res.reason = `not expected error but got ${result.errorType}`;
        }
        else if (!expectedResult.errorType && !result.errorType
            && expectedResult.data && !result.data) {
            res.reason = `expected has data ${expectedResult.data} but got null`;
        }
        else if (!expectedResult.errorType && !result.errorType
            && expectedResult.data && result.data) {
            const reason = compare(expectedResult.data, result.data);
            if (!reason) {
                res.reason = `expected has data ${JSON.stringify(expectedResult.data)} but got null`;
            }
        }
        else {
            res.success = true;
        }
        exports.results.push(res);
        return res;
    }
    callbackResult(name, subj, data, func) {
        const reason = func(data);
        if (!reason || reason === '') {
            utils_1.default.onNext(subj, createSuccessResult(name));
        }
        else {
            utils_1.default.onNext(subj, createFailResult(name, reason));
        }
    }
    getToken(token) {
        return {
            clientId: token.cId,
            connectionId: token.conId ? token.conId.connectionId : undefined,
            loginMethod: token.lm,
            refreshTokenId: token.rId,
            scopeGroupIds: token.sgIds,
            serviceCode: token.sc,
            serviceId: token.conId ? token.conId.serviceId : undefined,
            serviceName: token.conId ? token.conId.serviceName : undefined,
            serviceUserId: token.suId,
            userId: token.uId,
        };
    }
}
exports.CommonTest = CommonTest;
//# sourceMappingURL=CommonTest.js.map