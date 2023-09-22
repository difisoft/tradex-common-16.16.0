import { IKafkaMessage, StreamHandler } from "./StreamHandler";
import { logger } from "../log";
import { IConf, IMessage, ISendMessage, MessageType, PromiseState, SEND_MESSAGE_TYPE } from "./types";
import { createFromStatus, TimeoutError } from "../errors";
import GeneralError from "../errors/GeneralError";
import IResponse from "../models/IResponse";
import State from "../utils/State";
import Rx = require("rx");
import Kafka = require("node-rdkafka");
import { diffMsTime } from "../utils/mstime";

const LOW_PRODUCER_READY = "LOW_PRODUCER_READY";
const HIGH_PRODUCER_READY = "HIGH_PRODUCER_READY";
const LOW_PRODUCER_CONNECT = "LOW_PRODUCER_CONNECT";
const HIGH_PRODUCER_CONNECT = "HIGH_PRODUCER_CONNECT";
const CONSUMER = "CONSUMER";

class SendRequestCommon {
  protected messageId: number = 0;
  protected producer: any;
  protected highLatencyProducer: any;
  protected readonly responseTopic: string;
  protected bufferedMessages: ISendMessage[] = [];
  protected highLatencyBufferedMessages: ISendMessage[] = [];
  protected isReady: boolean = false;
  protected isHighLatencyReady: boolean = false;
  protected readyState: State<boolean>;

  constructor(
    protected conf: IConf,
    protected handleSendError?: (e: Error) => boolean,
    producerOptions?: any,
    topicOptions?: any,
    readyCallback?: () => void,
    moreReadyStateFields?: string[]
  ) {
    if (readyCallback != null) {
      let fields = [HIGH_PRODUCER_READY, LOW_PRODUCER_READY, LOW_PRODUCER_CONNECT, HIGH_PRODUCER_CONNECT];
      if (moreReadyStateFields != null) {
        fields = fields.concat(moreReadyStateFields);
      }
      this.readyState = new State(fields, true, () => false);
      this.readyState.subscribeCompleted().subscribe(readyCallback);
    }
    this.responseTopic = `${this.conf.clusterId}.response.${this.conf.clientId}`;
    const ops = {
      ...{
        "client.id": conf.clientId,
        "metadata.broker.list": this.conf.kafkaUrls.join(),
        "retry.backoff.ms": 200,
        "message.send.max.retries": 10,
        "batch.num.messages": 5,
        "message.max.bytes": 1000000000,
        "fetch.message.max.bytes": 1000000000
      }, ...producerOptions
    };
    const topicOps = topicOptions ? topicOptions : {};
    this.producer = new Kafka.Producer(ops, topicOps);
    this.producer.connect({
      topic: "",
      allTopics: true,
      timeout: 30000
    }, () => {
      logger.info("low latency producer connect");
      if (this.readyState != null) {
        this.readyState.setState(LOW_PRODUCER_CONNECT, true);
      }
    });
    this.producer.on("ready", () => {
      logger.info("low latency producer ready", this.readyState);
      this.isReady = true;
      if (this.readyState != null) {
        this.readyState.setState(LOW_PRODUCER_READY, true);
      }
      this.bufferedMessages.forEach(this.reallySendMessage);
    });
    this.producer.on("event.error", (err: Error) => {
      logger.logError("producer error", err);
    });
    const highLatencyOps = {
      ...{
        "client.id": conf.clientId,
        "metadata.broker.list": this.conf.kafkaUrls.join(),
        "retry.backoff.ms": 200,
        "message.send.max.retries": 10,
        "message.max.bytes": 1000000000,
        "fetch.message.max.bytes": 1000000000
      }, ...producerOptions
    };
    this.highLatencyProducer = new Kafka.Producer(highLatencyOps, topicOps);
    this.highLatencyProducer.connect({
      topic: "",
      allTopics: true,
      timeout: 30000
    }, () => {
      logger.info("producer connect");
      if (this.readyState != null) {
        this.readyState.setState(HIGH_PRODUCER_CONNECT, true);
      }
    });
    this.highLatencyProducer.on("ready", () => {
      logger.info("high latency producer ready", this.readyState);
      this.isHighLatencyReady = true;
      if (this.readyState != null) {
        this.readyState.setState(HIGH_PRODUCER_READY, true);
      }
      this.highLatencyBufferedMessages.forEach(this.reallySendMessage);
    });
    this.highLatencyProducer.on("event.error", (err: Error) => {
      logger.logError("producer error", err);
    });
  }

  public getResponseTopic(): string {
    return this.responseTopic;
  }

  public sendMessage(transactionId: string, topic: string, uri: string, data: any, highLatency: boolean = true): void {
    const message: ISendMessage = this.createMessage(transactionId, topic, uri, data);
    message.highLatency = highLatency;
    this.sendMessageCheckReady(message, highLatency);
  };

  public sendRaw(topic: string, data: any, highLatency: boolean = true): void {
    const message: ISendMessage = {
      raw: true,
      message: data,
      topic: topic,
      highLatency: highLatency,
    };
    this.sendMessageCheckReady(message, highLatency);
  };

  public sendForwardMessage(originMessage: any, newTopic: string, newUri: string): void {
    const message: ISendMessage = {
      topic: newTopic,
      message: originMessage
    };
    message.message.uri = newUri;
    this.sendMessageCheckReady(message, false);
  };

  public sendResponse(transactionId: string | number, messageId: string, topic: string, uri: string, data: any): void {
    const message: ISendMessage = this.createMessage(transactionId, topic, uri, data, MessageType.RESPONSE,
      undefined, undefined, messageId);
    this.sendMessageCheckReady(message, false);
  };

  public sendMessageCheckReady(message: ISendMessage, highLatency: boolean) {
    if (highLatency) {
      if (!this.isHighLatencyReady) {
        this.highLatencyBufferedMessages.push(message);
        return;
      }
    } else {
      if (!this.isReady) {
        this.bufferedMessages.push(message);
        return;
      }
    }
    this.reallySendMessage(message);
  }

  protected timeout(message: ISendMessage) {
    // do nothing
  }

  protected doReallySendMessage(message: ISendMessage): void {
    try {
      const msgContent = JSON.stringify(message.message);
      if (message.highLatency === true) {
        logger.info(`send message ${msgContent} to topic ${message.topic}`);
        this.highLatencyProducer.produce(message.topic, null, new Buffer(msgContent), null, Date.now());
      } else {
        logger.info(`send low latency message ${msgContent} to topic ${message.topic}`);
        this.producer.produce(message.topic, null, new Buffer(msgContent), null, Date.now());
      }
      if (message.timeout) {
        setTimeout(() => this.timeout(message), message.timeout);
      }
    } catch (e) {
      if (!this.handleSendError || !this.handleSendError(e)) {
        if (e.message.indexOf("Local: Queue full") > -1) {
          logger.logError("error while sending the message. exitting...", e);
          process.exit(1);
        } else {
          logger.logError("error while sending the message", e);
        }
      }
    }
  }

  protected reallySendMessage: (message: ISendMessage) => void = (message: ISendMessage) => {
    this.doReallySendMessage(message);
  };

  protected getMessageId(): string {
    this.messageId++;
    return `${this.messageId}`;
  }

  protected createMessage(transactionId: string | number, topic: string, uri: string
    , data: any, messageType: MessageType = MessageType.MESSAGE
    , responseTopic?: string, responseUri?: string, messageId?: string, timeout?: number): ISendMessage {
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
  };
}

class SendRequest extends SendRequestCommon {
  private requestedMessages: Map<string, ISendMessage> = new Map<string, ISendMessage>();
  private readonly expiredIn: number = 0;

  constructor(
    conf: IConf,
    consumerOptions: any,
    initListener: boolean = true,
    topicConf: any = {},
    handleSendError?: (e: Error) => boolean,
    producerOptions?: any,
    readyCallback?: () => void,
    expiredIn?: number
  ) {
    super(conf, handleSendError, producerOptions, topicConf, readyCallback, initListener ? [CONSUMER] : null);
    this.expiredIn = expiredIn ? expiredIn : 10000;
    if (initListener) {
      logger.info(`init response listener ${this.responseTopic}`);
      const topicOps = {...topicConf, "auto.offset.reset": "earliest"};
      new StreamHandler(this.conf, consumerOptions, [this.responseTopic]
        , (data: IKafkaMessage) => this.handlerResponse(data), topicOps, () => {
          if (this.readyState != null) {
            logger.info("response consumer ready", this.readyState);
            this.readyState.setState(CONSUMER, true);
          }
        }
      );
    }
  }

  public async sendRequestAsync(transactionId: string, topic: string, uri: string, data: any, timeout?: number): Promise<IMessage> {
    const promise: PromiseState<IMessage> = new PromiseState();
    this.sendRequestBase(transactionId, topic, uri, data, promise, SEND_MESSAGE_TYPE.PROMISE, timeout);
    return promise.promise();
  };


  public sendRequest(transactionId: string, topic: string, uri: string, data: any, timeout?: number): Rx.Observable<IMessage> {
    const subject: Rx.Subject<IMessage> = new Rx.Subject();
    this.sendRequestBase(transactionId, topic, uri, data, subject, SEND_MESSAGE_TYPE.OBSERVABLE, timeout);
    return subject;
  };

  public sendRequestBase(transactionId: string, topic: string, uri: string, data: any, subject: Rx.Subject<IMessage> | PromiseState<IMessage>, sendType?: number, timeout?: number) {
    const message: ISendMessage = this.createMessage(transactionId, topic, uri, data, MessageType.REQUEST
      , this.responseTopic, "REQUEST_RESPONSE", null, timeout);
    message.subject = subject;
    message.timeout = timeout;
    message.sendType = sendType;
    if (!this.isReady) {
      this.bufferedMessages.push(message);
    } else {
      this.reallySendMessage(message);
    }
  };

  protected reallySendMessage: (message: ISendMessage) => void = (message: ISendMessage) => {
    if (message.subject) {
      this.requestedMessages.set(message.message.messageId, message);
    }
    super.doReallySendMessage(message);
  };

  protected timeout(message: ISendMessage) {
    const msgId: string = message.message.messageId;
    if (this.requestedMessages.has(msgId)) {
      this.respondError(message, new TimeoutError());
      this.requestedMessages.delete(msgId);
    }
  }

  private respondData(message: ISendMessage, data: IMessage) {
    if (message.subject == null) {
      return;
    }
    if (message.sendType === SEND_MESSAGE_TYPE.PROMISE) {
      (<PromiseState<IMessage>>(message.subject)).resolve(data);
    } else {
      (<Rx.Subject<IMessage>>(message.subject)).onNext(data);
      (<Rx.Subject<IMessage>>(message.subject)).onCompleted();
    }
  }

  private respondError(message: ISendMessage, err: Error) {
    if (message.subject == null) {
      return;
    }
    if (message.sendType === SEND_MESSAGE_TYPE.PROMISE) {
      (<PromiseState<IMessage>>(message.subject)).reject(err);
    } else {
      (<Rx.Subject<IMessage>>(message.subject)).onError(err);
    }
  }

  private handlerResponse(message: IKafkaMessage) {
    const msgStr = message.value.toString();
    try {
      if (message.timestamp != null && message.timestamp > 0 && this.expiredIn > 0 && diffMsTime(message.timestamp) > this.expiredIn) {
        logger.warn("ignore this request since it's expired %s", msgStr);
        return;
      }
    } catch (e) {
      logger.error("fail to handle message time", e);
    }
    const msg: IMessage = JSON.parse(msgStr);
    const data =  this.requestedMessages.get(msg.messageId);
    if (data != null) {
      this.respondData(data, msg);
      this.requestedMessages.delete(msg.messageId);
    } else {
      logger.warn(`cannot find where to response (probably timeout happen) "${msgStr}"`);
    }
  }
}

let instance: SendRequest = null;

function create(conf: IConf, consumerOptions: any,
                initResponseListener: boolean = true,
                topicConf: any = {},
                producerOptions: any = {},
                readyCallback?: () => void
): void {
  instance = new SendRequest(conf, consumerOptions, initResponseListener, topicConf, null, producerOptions, readyCallback);
}

function getInstance(): SendRequest {
  return instance;
}


function getResponse<T>(msg: IMessage): T {
  if (msg.data != null) {
    const response: IResponse = msg.data;
    if (response.status != null) {
      throw createFromStatus(response.status);
    } else {
      return <T>response.data;
    }
  } else {
    logger.error("no data in response of message", msg);
    throw new GeneralError();
  }
}

export {
  SendRequest,
  SendRequestCommon,
  create,
  getInstance,
  getResponse
};