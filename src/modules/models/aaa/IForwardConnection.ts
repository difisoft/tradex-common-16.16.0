import { ForwardDataType } from "./ForwardDataType";
import ICommonForward from "./ICommonForward";

declare interface IForwardConnection extends ICommonForward {
  type: ForwardDataType, // tslint:disable-line
  uri_mapping: Map<string, string>, // serviceName: uri
}

export default IForwardConnection;