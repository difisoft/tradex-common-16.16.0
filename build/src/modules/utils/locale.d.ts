import 'isomorphic-fetch';
import { IStatus } from '../models';
declare const getLanguageCode: (acceptLanguageHeader: string) => string;
declare const init: (msNames: string, namespaceList: string[], requestTopic?: string, uri?: string) => void;
declare const initByOptions: (initOption: any) => void;
declare const initInternal: (msNames: string, namespaceList: string[], requestTopic?: string, uri?: string) => void;
declare const getInstance: () => any;
declare const translateErrorMessage: (errorObject: IStatus, lang: string) => IStatus;
export { getLanguageCode, init, initInternal, initByOptions, getInstance, translateErrorMessage };
