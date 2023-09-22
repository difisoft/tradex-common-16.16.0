"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const rx_1 = require("rx");
index_1.Logger.create({
    appenders: { application: { type: 'console' } },
    categories: { default: { appenders: ['application'], level: 'info' } }
}, true);
const clientId = 'testLatency';
const nodeId = '000001';
const conf = {
    clientId: nodeId,
    clusterId: clientId,
    kafkaUrls: ['localhost:9092'],
};
index_1.Kafka.create(conf, {});
const sendRequest = index_1.Kafka.getInstance();
const messageHandler = new index_1.Kafka.MessageHandler();
new index_1.Kafka.StreamHandler(conf, {}, [clientId], (message) => messageHandler.handle(message, handleRequest));
let totalHTT = 0;
let totalRTT = 0;
function handleRequest(msg) {
    const latency = new Date().getTime() - msg.data.time;
    console.log('half latency:' + latency);
    totalHTT += latency;
    return rx_1.Observable.from([msg.data]);
}
;
let totalMessage = 0;
let maxMessage = 1000;
function runInSequence() {
    totalMessage++;
    if (totalMessage > maxMessage) {
        console.log(`final latency: ${totalHTT / maxMessage} ${totalRTT / maxMessage}`);
        return;
    }
    sendRequest.sendRequest('', clientId, '', { time: new Date().getTime() }).subscribe((msg) => {
        const latency = new Date().getTime() - msg.data.data.time;
        console.log('latency:' + latency);
        totalRTT += latency;
        runInSequence();
    }, (err) => {
        console.error(err);
        totalMessage--;
        console.log(`error latency: ${totalHTT / totalMessage} ${totalRTT / totalMessage}`);
    });
}
let totalReceived = 0;
function runInAsync() {
    for (let i = 0; i < maxMessage; i++) {
        sendRequest.sendRequest('', clientId, '', { time: new Date().getTime() }).subscribe((msg) => {
            totalReceived++;
            const latency = new Date().getTime() - msg.data.data.time;
            console.log('latency:' + latency);
            totalRTT += latency;
            if (totalReceived == maxMessage) {
                console.log(`final latency: ${totalHTT / maxMessage} ${totalRTT / maxMessage}`);
            }
        }, (err) => {
            totalReceived++;
            console.error(err);
        });
    }
}
setTimeout(process.argv.length > 2 ? runInSequence : runInAsync, 10000);
//# sourceMappingURL=TestLatency.js.map