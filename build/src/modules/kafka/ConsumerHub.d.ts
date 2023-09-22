import { IConf, IMessage } from "./types";
import { Handle } from "./MessageHandler";
export interface IConsumerProcess {
    process(msg: IMessage): any;
}
export interface IRawProcessor {
    process: Handle;
}
export declare class ConsumerHub {
    private conf;
    private options;
    private rawMapping;
    private mapping;
    private topicConf;
    private readyCallback?;
    private rawHandle;
    private handle;
    private stream;
    constructor(conf: IConf, options: any, rawMapping: {
        [key: string]: IRawProcessor;
    }, mapping: {
        [key: string]: IConsumerProcess;
    }, topicConf?: any, readyCallback?: () => void);
    createStream(): void;
    addProcess(topic: string, process: IConsumerProcess): void;
    addRawProcess(topic: string, process: IRawProcessor): void;
}
