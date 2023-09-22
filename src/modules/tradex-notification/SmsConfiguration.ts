import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";

export default class SmsConfiguration implements IConfiguration {
  public phoneNumber: string;
  public domain: string;

  public getMethod(): MethodEnum {
    return MethodEnum.SMS;
  }
}