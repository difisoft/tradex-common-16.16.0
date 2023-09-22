import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";
export default class SmsConfiguration implements IConfiguration {
    phoneNumber: string;
    domain: string;
    getMethod(): MethodEnum;
}
