import { ConsumerStream, ConsumerTopicConfig, createReadStream } from 'node-rdkafka';
import { logger } from '../log';
import { IConf } from "./types";

interface IKafkaMessage {
  value: Buffer;
  size: number;
  topic: string;
  offset: number;
  partition: number;
  key: string;
  timestamp: number;
}

class StreamHandler {
  private hasError: boolean;
  private stream: ConsumerStream;

  constructor(conf: IConf, options: ConsumerTopicConfig, topics: string[]
              , dataHandler: (data: IKafkaMessage, handler: StreamHandler) => void
              , topicConf: any = {}
              , readyCallback?: () => void
  ) {
    const ops = {
      ...{
        'group.id': conf.clusterId,
        'metadata.broker.list': conf.kafkaUrls.join(),
        // 'allow.auto.create.topics': true,
      }, ...options
    };

    this.hasError = false;
    this.stream = createReadStream(ops, topicConf, {
      topics: topics
    });

    if (readyCallback) {
      this.stream.consumer.on('ready', readyCallback);
    }

    this.stream.on('error', (err: any) => {
      logger.error('error on kafka', topics, err);
      this.hasError = true;
      setTimeout(() => {
        if (this.hasError) {
          logger.logError('error flag still on. preparing to exit in 2 seconds', topics);
          setTimeout(() => process.exit(1), 2000);
        }
      }, 15000)
    });

    this.stream.on('data', (data: any) => {
      this.hasError = false;
      dataHandler(<IKafkaMessage>data, this);
    });

    this.stream.on('throttle', (data: any) => {
      logger.warn("kafka throttle happens", data);
    });
  }

  public close() {
    this.stream.close();
  }
}

function createBroadcastListener(conf: IConf, options: any, topics: string[]
  , dataHandler: (data: IKafkaMessage, handler: StreamHandler) => void, topicConf: any = {}
) {
  const opt = {
    ...{
      'group.id': conf.clientId,
    }, ...options
  };
  return new StreamHandler(conf, opt, topics, dataHandler, topicConf);
}

export {
  StreamHandler,
  IKafkaMessage,
  createBroadcastListener
};