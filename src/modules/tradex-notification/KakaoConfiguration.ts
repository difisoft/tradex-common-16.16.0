import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";

export default class KakaoConfiguration implements IConfiguration {
  public to: string;
  public from: string;// tslint:disable-line
  public resend: boolean;
  public templateCode: string;

  public getMethod(): MethodEnum {
    return MethodEnum.KAKAO;
  }
}