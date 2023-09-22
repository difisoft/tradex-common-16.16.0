/// <reference types="rx-core" />
/// <reference types="rx-core-binding" />
/// <reference types="rx-lite" />
/// <reference types="rx-lite-aggregates" />
/// <reference types="rx-lite-backpressure" />
/// <reference types="rx-lite-coincidence" />
/// <reference types="rx-lite-experimental" />
/// <reference types="rx-lite-joinpatterns" />
/// <reference types="rx-lite-time" />
import { Observable } from "rx";
import { IMessage } from "./types";
import { SendRequest } from "./SendRequest";
import IResponse from "../models/IResponse";
import { IKafkaMessage } from './StreamHandler';
declare type HandleResult = Observable<any> | Promise<any> | boolean;
declare type Handle = (msg: IMessage, originalMessage?: IKafkaMessage) => HandleResult;
declare class MessageHandler {
    private sendRequest;
    protected activeRequestMap: {
        [k: string]: IMessage;
    };
    private timeoutinMs?;
    private requestId;
    constructor(sendRequest?: SendRequest, timeoutinMs?: number);
    getActiveMessage: (msgId: string) => IMessage | undefined;
    handle: (message: IKafkaMessage, func: Handle) => void;
    getErrorMessage: (error: Error) => IResponse;
    private shouldResponse;
}
declare function getErrorMessage(error: Error): IResponse;
export { HandleResult, Handle, MessageHandler, getErrorMessage, };
