import IConnectionIdentifier from './IConnectionIdentifier';
declare interface ILoginNotify {
    serviceName: string;
    username: string;
    userInfo: any;
    conId: IConnectionIdentifier;
}
export default ILoginNotify;
