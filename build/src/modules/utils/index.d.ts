/// <reference types="rx-core" />
/// <reference types="rx-lite" />
import { onError, onNext, transform, transformAsync, transformError, transformPromise, transformPromiseAsync, transformSingle, transformSingleAsync, transformSinglePromise } from "./rx";
import { createFailFromError, createFailValidation, createSuccessValidation, validate, Validate, validateEmail, validatePassword } from "./validation";
import { setObjKey } from "./ObjectUtils";
import { convertToken, undefinedOr } from "./token";
import { getForwardUri } from "./scope";
import { processJwtKey, processJwtKeyByDomain, processJwtKeyObject } from "./keys";
import State from "./State";
import { allPromiseDone, asyncWithRetry, handlePromise, IPromiseJoin, promise, PromiseFunction, Reject, Resolve, RetryError } from "./promise";
import * as Mongo from "./mongo";
import { createJwtConfig, getEnvArr, getEnvJson, getEnvNum, getEnvStr, getEnvBool, override } from "./config";
import { diffMsTime, getMsTime } from "./mstime";
declare const _default: {
    validate: typeof validate;
    validateEmail: typeof validateEmail;
    validatePassword: typeof validatePassword;
    doSafe: (observable: Rx.Observer<any>, func: any) => void;
    onError: typeof onError;
    onNext: typeof onNext;
    transform: typeof transform;
    transformError: typeof transformError;
    transformAsync: typeof transformAsync;
    transformPromise: typeof transformPromise;
    transformPromiseAsync: typeof transformPromiseAsync;
    singleton: import("./Singleton").Singleton;
    transformSingle: typeof transformSingle;
    transformSingleAsync: typeof transformSingleAsync;
    transformSinglePromise: typeof transformSinglePromise;
    createFailFromError: typeof createFailFromError;
    createFailValidation: typeof createFailValidation;
    createSuccessValidation: typeof createSuccessValidation;
    Validate: typeof Validate;
    formatDateToDisplay: (date: Date, format?: string) => string;
    compareDateOnly: (date1: Date, date2: Date) => number;
    convertStringToDate: (data: string, format?: string) => Date;
    MINUTE_DATE_DISPLAY_FORMAT: string;
    DATETIME_DISPLAY_FORMAT: string;
    DATE_DISPLAY_FORMAT: string;
    TIME_DISPLAY_FORMAT: string;
    generateToken: (length?: number, onlyDigit?: boolean) => string;
    convertToken: typeof convertToken;
    undefinedOr: typeof undefinedOr;
    getLanguageCode: (acceptLanguageHeader: string) => string;
    initI18n: (msNames: string, namespaceList: string[], requestTopic?: string, uri?: string) => void;
    initI18nInternal: (msNames: string, namespaceList: string[], requestTopic?: string, uri?: string) => void;
    initByOptions: (initOption: any) => void;
    getI18nInstance: () => any;
    translateErrorMessage: (errorObject: import("../models").IStatus, lang: string) => import("../models").IStatus;
    initTemplateResource: (msNames: string, requestTopic?: string, uri?: string) => void;
    getTemplateResources: () => any[];
    compileTemplate: (templateUrl: string, data: any) => Promise<string>;
    getForwardUri: typeof getForwardUri;
    isEmpty: (input: string) => boolean;
    rightPad: (str: string, size: number, padString: string) => string;
    leftPad: (str: string, size: number, padString: string) => string;
    isNullOrUndefined: (input: any) => boolean;
    countDaysOfAYear: (year: number) => number;
    getStartOfDate: (date: Date) => Date;
    getEndOfDate: (date: Date) => Date;
    countDayBetween: (dateFrom: Date, dateTo: Date) => number;
    isWeekend: (date: Date) => boolean;
    getStartOfWeek: (date: Date) => Date;
    getEndOfWeek: (date: Date) => Date;
    getStartOfMonth: (date: Date) => Date;
    getEndOfMonth: (date: Date) => Date;
    round: (input: number, scale?: number) => number;
    roundInt: (input: number, scale?: number) => number;
    processJwtKey: typeof processJwtKey;
    processJwtKeyByDomain: typeof processJwtKeyByDomain;
    processJwtKeyObject: typeof processJwtKeyObject;
    TRADEX_DOMAIN: string;
    container: Map<string, any>;
    promise: typeof promise;
    handlePromise: typeof handlePromise;
    RetryError: typeof RetryError;
    asyncWithRetry: typeof asyncWithRetry;
    removeDuplicateObj: (arr: any[], fieldName: any) => any[];
    VCSC_DOMAIN: string;
    DOMAINS: {
        TRADEX_DOMAIN: string;
        VCSC_DOMAIN: string;
    };
    allPromiseDone: typeof allPromiseDone;
    Mongo: typeof Mongo;
    setObjKey: typeof setObjKey;
    createJwtConfig: typeof createJwtConfig;
    getEnvArr: typeof getEnvArr;
    getEnvNum: typeof getEnvNum;
    getEnvStr: typeof getEnvStr;
    getEnvJson: typeof getEnvJson;
    getEnvBool: typeof getEnvBool;
    override: typeof override;
    diffMsTime: typeof diffMsTime;
    getMsTime: typeof getMsTime;
    convertISO8601StringToDate: (data: string) => Date;
    formatISO8601StringToDate: (data: Date) => string;
    rsaEncrypt: (data: string, publicKey: string) => string;
    rsaDecrypt: (data: string, privateKey: string) => string;
};
export default _default;
export { State, Resolve, Reject, PromiseFunction, IPromiseJoin };
