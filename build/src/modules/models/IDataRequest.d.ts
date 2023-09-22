import IHeaders from './IHeaders';
export default interface IDataRequest {
    headers?: IHeaders;
    sourceIp?: string;
    deviceType?: string;
}
