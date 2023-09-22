import IConfiguration from './IConfiguration';
import MethodEnum from './MethodEnum';

export default class SocketClusterConfiguration implements IConfiguration {
  public channel: string;

  public getMethod(): MethodEnum {
    return MethodEnum.SOCKET_CLUSTER;
  }
}