import ICommonForward from "./ICommonForward";

declare interface IForwardService extends ICommonForward {
  service: string, // serviceName: uri
  uri: string, // serviceName: uri
}

export default IForwardService;