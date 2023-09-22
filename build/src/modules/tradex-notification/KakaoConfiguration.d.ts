import IConfiguration from "./IConfiguration";
import MethodEnum from "./MethodEnum";
export default class KakaoConfiguration implements IConfiguration {
    to: string;
    from: string;
    resend: boolean;
    templateCode: string;
    getMethod(): MethodEnum;
}
