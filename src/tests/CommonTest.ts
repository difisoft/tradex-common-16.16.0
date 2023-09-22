import * as Kafka from './../modules/kafka';
import Utils from './../modules/utils';
import { Subject } from "rx";
import { IToken } from '../modules/models';

declare interface IExpectedResult {
  txId?: string,
  errorType?: string,
  data?: Kafka.IMessage | string,
  subject?: Subject<IExpectedResult>,
}

declare type TestFunc = (name: string, txId: string) => Subject<ITestResult>;

interface ITestResult {
  testName: string
  success: boolean,
  reason?: string,
}

function createSuccessResult(name: string): ITestResult {
  return {
    testName: name,
    success: true,
  };
}

function createFailResult(name: string, reason: string): ITestResult {
  return {
    testName: name,
    success: false,
    reason: reason,
  };
}

export const results: ITestResult[] = [];

declare type Condition = (message: Kafka.IMessage) => boolean;
declare type Callback = (data: Kafka.IMessage) => void;

class ListenTopic {
  private conditions: Condition[] = [];
  private callbacks: Callback[] = [];
  private streamHandler: Kafka.StreamHandler;

  public when(condition: Condition, callback: Callback): void {
    this.conditions.push(condition);
    this.callbacks.push(callback);
  }

  public handler: (data: any, streamHandler: Kafka.StreamHandler) => void
    = (data: any, streamHandler: Kafka.StreamHandler) => {
    this.streamHandler = streamHandler;
    const msg: string = data.value.toString();
    const message: Kafka.IMessage = JSON.parse(msg);
    for (let i: number = 0; i < this.conditions.length; i++) {
      if (this.conditions[i](message)) {
        this.callbacks[i](message);
      }
    }
  };

  public close() {
    this.streamHandler.close();
  }
}

abstract class CommonTest {
  protected testConfiguration: Kafka.IConf;
  protected request: Kafka.SendRequest;
  protected expectedResults: Map<string, IExpectedResult> = new Map<string, IExpectedResult>();
  protected currentTransactionId: number = 0;
  protected baseNumber: number = new Date().getTime();

  protected constructor(conf: Kafka.IConf) {
    this.testConfiguration = {
      clientId: 'testingClientId',
      clusterId: conf.clusterId,
      kafkaUrls: conf.kafkaUrls,
    };
    this.request = new Kafka.SendRequest(this.testConfiguration, {}, false);
  }

  protected listenTopic(topic?: string): ListenTopic {
    const listeningTopic: string = topic ? topic : this.request.getResponseTopic();
    const listenTopic: ListenTopic = new ListenTopic();
    new Kafka.StreamHandler(this.testConfiguration, {}, [listeningTopic], listenTopic.handler);
    return listenTopic;
  }

  protected listenTopics(topics: string[]): ListenTopic {
    const listenTopic: ListenTopic = new ListenTopic();
    new Kafka.StreamHandler(this.testConfiguration, {}, topics, listenTopic.handler);
    return listenTopic;
  }

  protected sendMessage(topic: string, uri: string, data: any, tx?: string): string {
    const txId: string = tx ? tx : this.getNewTxId();
    this.request.sendMessage(txId, topic, uri, data);
    return txId;
  }

  protected sendRequest(topic: string, uri: string, data: any, tx?: string): string {
    const txId: string = tx ? tx : this.getNewTxId();
    this.request.sendRequest(txId, topic, uri, data);
    return txId;
  }

  protected sendResponse(msgId: string, topic: string, uri: string, data: any, tx?: string): string {
    const txId: string = tx ? tx : this.getNewTxId();
    this.request.sendResponse(txId, msgId, topic, uri, data);
    return txId;
  }

  protected abstract run(): Subject<ITestResult>;

  protected runTests(instance: any, funcs: TestFunc[], timeOut: number = 40000): Subject<ITestResult> {
    const length: number = funcs.length;
    let finishTotal: number = 0;
    const subject: Subject<ITestResult> = new Subject();
    funcs.forEach((func: TestFunc) => this.runTest(instance, func, timeOut).subscribe(
      (data: ITestResult) => {
        subject.onNext(data);
        finishTotal++;
        if (finishTotal === length) {
          subject.onCompleted();
        }
      }, (err: Error) => {
        subject.onNext(createFailResult(name, `encounter error ${JSON.stringify(err)}`));
        finishTotal++;
        if (finishTotal === length) {
          subject.onCompleted();
        }
      }));
    return subject
  }

  protected runTest(instance: any, func: TestFunc, timeOut: number = 20000
  ): Subject<ITestResult> {
    const subject: Subject<ITestResult> = new Subject();
    const txId: string = this.getNewTxId();
    const name: string = `${typeof instance}.${func.name}`;
    setTimeout(() => {
      if (this.expectedResults[txId]) {
        Utils.onNext(subject, {
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
    func(name, txId).subscribe(
      (data: ITestResult) => {
        if (this.expectedResults[txId]) {
          Utils.onNext(subject, data);
          delete this.expectedResults[txId];
        }
      },
      (err: Error) => {
        if (this.expectedResults[txId]) {
          Utils.onNext(subject, createFailResult(name, `encounter error ${JSON.stringify(err)}`));
          delete this.expectedResults[txId];
        }
      },
    );
    return subject;
  }

  protected getNewTxId(): string {
    this.currentTransactionId++;
    return `${this.baseNumber + this.currentTransactionId}`;
  }

  protected createResult(name: string, expectedResult: IExpectedResult
    , result: IExpectedResult, compare: (expectedData: any, resultData: any) => string
  ): ITestResult {
    const res: ITestResult = {
      testName: name,
      success: false,
      reason: '',
    };
    if (expectedResult.errorType && (!result.errorType || result.errorType !== expectedResult.errorType)) {
      res.reason = `expected error type ${expectedResult.errorType} but got ${result.errorType}`;
    } else if (!expectedResult.errorType && result.errorType) {
      res.reason = `not expected error but got ${result.errorType}`;
    } else if (!expectedResult.errorType && !result.errorType
      && expectedResult.data && !result.data) {
      res.reason = `expected has data ${expectedResult.data} but got null`;
    } else if (!expectedResult.errorType && !result.errorType
      && expectedResult.data && result.data) {
      const reason: string = compare(expectedResult.data, result.data);
      if (!reason) {
        res.reason = `expected has data ${JSON.stringify(expectedResult.data)} but got null`;
      }
    } else {
      res.success = true;
    }
    results.push(res);
    return res;
  }

  protected callbackResult(name: string, subj: Subject<ITestResult>, data: Kafka.IMessage, func: (data?: Kafka.IMessage) => string) {
    const reason: string = func(data);
    if (!reason || reason === '') {
      Utils.onNext(subj, createSuccessResult(name));
    } else {
      Utils.onNext(subj, createFailResult(name, reason));
    }
  }

  protected getToken(token: any): IToken {
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

export {
  CommonTest,
  ListenTopic,
  Callback,
  Condition,
  ITestResult,
  IExpectedResult,
  createFailResult,
  createSuccessResult,
  TestFunc,
}