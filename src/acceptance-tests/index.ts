import { Kafka, Logger } from '../index';

Logger.create({
  appenders: { application: { type: 'console'} },
  categories: { default: { appenders: ['application'], level: 'info' } }
}, true);

const sendRequest = new Kafka.SendRequest(
  {
    clientId: 'test',
    clusterId: '001',
    kafkaUrls: ['localhost:9092'],
  }, {}
);

const message = 'dshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkhdshgkhdgkdhgkdhkghdkfhgdkh';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push(message);
}

function doSendMessage() {
  sendRequest.sendMessage('txId', 'test-queue-full', '', data);
}

setInterval(doSendMessage, 200);