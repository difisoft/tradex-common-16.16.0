import { IConnectionIdentifier } from '.';
export default interface IForwardUriResult {
    topic?: string;
    uri?: string;
    conId?: IConnectionIdentifier;
}
