import { IScope } from '../models/aaa';
import { IToken, IForwardUriResult } from '../models';
export interface IInputUri {
    uri: string;
}
export declare function getForwardUri(msg: IInputUri | string, matchedScope: IScope, token: IToken, transformUriMap?: any): IForwardUriResult;
