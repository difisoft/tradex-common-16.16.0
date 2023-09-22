import IConfiguration from './IConfiguration';
import MethodEnum from './MethodEnum';
export default class SocketClusterConfiguration implements IConfiguration {
    channel: string;
    getMethod(): MethodEnum;
}
