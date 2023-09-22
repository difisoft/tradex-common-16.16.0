import { SendRequestCommon } from "../kafka";
import IConf from "./IConf";
export declare const defaultInterval: number;
export declare const defaultTopic: string;
export default class SendRegistration {
    private send;
    private readonly serviceRegistration;
    private readonly topic;
    constructor(send: SendRequestCommon, conf: IConf);
    private doRegister;
}
export declare function create(send: SendRequestCommon, conf: IConf): void;
export declare function getInstance(): SendRegistration;
