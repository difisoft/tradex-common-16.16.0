import ICommonForward from "./ICommonForward";
declare interface IForwardService extends ICommonForward {
    service: string;
    uri: string;
}
export default IForwardService;
