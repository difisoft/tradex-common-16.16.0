import ITemplateData from './ITemplateData';

export default class SocketClusterData implements ITemplateData {
  public method: string;
  public payload: any;

  public getTemplate(): string {
    return 'socket_cluster_template';
  }
}