/// <reference types="rx-core-binding" />
import { ConsumerGlobalConfig } from "node-rdkafka";
import Rx from "rx";
interface IConf extends ConsumerGlobalConfig {
    clientId: string;
    clusterId: string;
    kafkaUrls: string[];
}
declare enum MessageType {
    MESSAGE = "MESSAGE",
    REQUEST = "REQUEST",
    RESPONSE = "RESPONSE"
}
declare const SEND_MESSAGE_TYPE: {
    OBSERVABLE: number;
    PROMISE: number;
};
declare class PromiseState<T> {
    private rs;
    private rj;
    private prom;
    constructor();
    resolve(v: T): void;
    reject(err: Error): void;
    promise(): Promise<T>;
}
declare interface ISendMessage {
    topic: string;
    subject?: Rx.Subject<IMessage> | PromiseState<IMessage>;
    message: IMessage | any;
    highLatency?: boolean;
    timeout?: number;
    sendType?: number;
    raw?: boolean;
}
declare interface IResponseDestination {
    topic: string;
    uri: string;
}
declare interface IMessage {
    messageType: MessageType;
    sourceId?: string;
    messageId: string;
    transactionId: string | number;
    uri?: string;
    responseDestination?: IResponseDestination;
    data: any;
    t?: number;
    et?: number;
    stream?: boolean;
    streamState?: string;
    streamIndex?: number;
    msgHandlerUniqueId?: string;
}
declare const STREAM_STATE: {
    NORMAL: string;
    FINSISH: string;
    ERROR: string;
};
export { IConf, MessageType, ISendMessage, IMessage, IResponseDestination, SEND_MESSAGE_TYPE, PromiseState, STREAM_STATE, };
