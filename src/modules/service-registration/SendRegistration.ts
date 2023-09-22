import { SendRequestCommon } from "../kafka";
import IConf from "./IConf";
import ServiceRegistration from "./ServiceRegistration";

export const defaultInterval: number = 300000;
export const defaultTopic: string = "service.register";

export default class SendRegistration {
  private readonly serviceRegistration: ServiceRegistration;
  private readonly topic: string;

  constructor(private send: SendRequestCommon, conf: IConf) {
    const interval: number = conf.interval ? conf.interval : defaultInterval;
    this.topic = conf.listeningTopic ? conf.listeningTopic : defaultTopic;
    this.serviceRegistration = new ServiceRegistration(conf.serviceName, conf.nodeId, 0);
    setInterval(() => this.doRegister(), interval);
  }

  private doRegister(): void {
    this.serviceRegistration.currentTime = new Date().getTime();
    this.send.sendMessage("", this.topic, "", this.serviceRegistration);
  }
}
let instance: SendRegistration = null;

export function create(send: SendRequestCommon, conf: IConf) {
  instance = new SendRegistration(send, conf);
}

export function getInstance(): SendRegistration {
  return instance;
}
