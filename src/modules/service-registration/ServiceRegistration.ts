export default class ServiceRegistration {
  public service: string;
  public nodeId: string;
  public currentTime: number;

  constructor(service: string, nodeId: string, currentTime: number) {
    this.service = service;
    this.nodeId = nodeId;
    this.currentTime = currentTime;
  }
};