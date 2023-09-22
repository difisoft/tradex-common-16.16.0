import ITemplateData from './ITemplateData';
export default class SocketClusterData implements ITemplateData {
    method: string;
    payload: any;
    getTemplate(): string;
}
