import { ForwardDataType } from "./ForwardDataType";
import ICommonForward from "./ICommonForward";
declare interface IForwardConnection extends ICommonForward {
    type: ForwardDataType;
    uri_mapping: Map<string, string>;
}
export default IForwardConnection;
