import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";

export default class EmailConfiguration implements IConfiguration {
  public toList: string[];
  public bccList: string[];
  public ccList: string[];
  public from: string;// tslint:disable-line
  public subject: string;

  public getMethod(): MethodEnum {
    return MethodEnum.EMAIL;
  }
}