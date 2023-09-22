/* tslint:disable */
import { Kafka, Logger } from '../index';
import { Observable } from 'rx';

Logger.create({
  appenders: { application: { type: 'console'} },
  categories: { default: { appenders: ['application'], level: 'info' } }
}, true);

const clientId = 'testLatency';
const nodeId = '000001';
const conf = {
  clientId: nodeId,
  clusterId: clientId,
  kafkaUrls: ['localhost:9092'],
};

Kafka.create(conf, {});

const sendRequest = Kafka.getInstance();

const messageHandler = new Kafka.MessageHandler();
new Kafka.StreamHandler(conf, {}, [clientId], (message: any) => messageHandler.handle(message, handleRequest));

let totalHTT: number = 0;
let totalRTT: number = 0;

function handleRequest(msg: Kafka.IMessage): Observable<any> | boolean {
  const latency: number = new Date().getTime() - msg.data.time;
  console.log('half latency:' + latency);
  totalHTT += latency;
  return Observable.from([msg.data]);
};

let totalMessage = 0;
let maxMessage = 1000;

function runInSequence() {
  totalMessage++;
  if (totalMessage > maxMessage) {
    console.log(`final latency: ${totalHTT/maxMessage} ${totalRTT/maxMessage}`);
    return;
  }
  sendRequest.sendRequest('', clientId, '', { time: new Date().getTime()}).subscribe(
    (msg: Kafka.IMessage) => {
      const latency: number = new Date().getTime() - msg.data.data.time;
      console.log('latency:' + latency);
      totalRTT += latency;
      runInSequence();
    },
    (err: any) => {
      console.error(err);
      totalMessage--;
      console.log(`error latency: ${totalHTT/totalMessage} ${totalRTT/totalMessage}`);
    }
  );
}

let totalReceived: number = 0;
function runInAsync() {
  for (let i: number = 0; i < maxMessage; i++) {
    sendRequest.sendRequest('', clientId, '', { time: new Date().getTime()}).subscribe(
      (msg: Kafka.IMessage) => {
        totalReceived++;
        const latency: number = new Date().getTime() - msg.data.data.time;
        console.log('latency:' + latency);
        totalRTT += latency;
        if (totalReceived == maxMessage) {
          console.log(`final latency: ${totalHTT/maxMessage} ${totalRTT/maxMessage}`);
        }
      },
      (err: any) => {
        totalReceived++;
        console.error(err);
      }
    );
  }
}

setTimeout(process.argv.length > 2 ? runInSequence : runInAsync, 10000);

