import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";
export default class EmailConfiguration implements IConfiguration {
    toList: string[];
    bccList: string[];
    ccList: string[];
    from: string;
    subject: string;
    getMethod(): MethodEnum;
}
