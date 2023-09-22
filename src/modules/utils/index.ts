import { doSafe } from "./arrowFunctions";
import {
  onError,
  onNext,
  transform,
  transformAsync,
  transformError,
  transformPromise,
  transformPromiseAsync,
  transformSingle,
  transformSingleAsync,
  transformSinglePromise
} from "./rx";
import {
  createFailFromError,
  createFailValidation,
  createSuccessValidation,
  validate,
  Validate,
  validateEmail,
  validatePassword
} from "./validation";
import { singleton } from "./Singleton";
import {
  compareDateOnly,
  convertStringToDate,
  MINUTE_DATE_DISPLAY_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATETIME_DISPLAY_FORMAT,
  TIME_DISPLAY_FORMAT,
  formatDateToDisplay,
  countDayBetween,
  isWeekend,
  getEndOfDate,
  getStartOfDate,
  countDaysOfAYear,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  convertISO8601StringToDate,
  formatISO8601StringToDate,
} from "./date";
import {rsaEncrypt, rsaDecrypt} from './rsa';
import { isEmpty, leftPad, rightPad } from "./StringUtils";
import { isNullOrUndefined, setObjKey } from "./ObjectUtils";
import { round, roundInt } from "./MathUtils";
import { removeDuplicateObj } from "./ArrayUtils";
import {
  generateToken,
  convertToken,
  undefinedOr,
} from "./token";
import {
  getInstance as getI18nInstance,
  getLanguageCode,
  init as initI18n,
  initInternal as initI18nInternal,
  translateErrorMessage
} from "./locale";
import { compileTemplate, getTemplateResources, init as initTemplateResource } from "./template";
import { getForwardUri } from "./scope";
import { DOMAINS, processJwtKey, processJwtKeyByDomain, processJwtKeyObject, TRADEX_DOMAIN, VCSC_DOMAIN } from "./keys";
import container from "./InstanceContainer";
import State from "./State";
import {
  allPromiseDone,
  asyncWithRetry,
  handlePromise,
  IPromiseJoin,
  promise,
  PromiseFunction,
  Reject,
  Resolve,
  RetryError
} from "./promise";
import * as Mongo from "./mongo";

import { 
  createJwtConfig, 
  getEnvArr, 
  getEnvJson, 
  getEnvNum, 
  getEnvStr,
  getEnvBool,
  override 
} from "./config";

import { 
  diffMsTime,
  getMsTime,
} from "./mstime";

export default {
  validate,
  validateEmail,
  validatePassword,
  doSafe,
  onError,
  onNext,
  transform,
  transformError,
  transformAsync,
  transformPromise,
  transformPromiseAsync,
  singleton,
  transformSingle,
  transformSingleAsync,
  transformSinglePromise,
  createFailFromError,
  createFailValidation,
  createSuccessValidation,
  Validate,
  formatDateToDisplay,
  compareDateOnly,
  convertStringToDate,
  MINUTE_DATE_DISPLAY_FORMAT,
  DATETIME_DISPLAY_FORMAT,
  DATE_DISPLAY_FORMAT,
  TIME_DISPLAY_FORMAT,
  generateToken,
  convertToken,
  undefinedOr,
  getLanguageCode,
  initI18n,
  initI18nInternal,
  getI18nInstance,
  translateErrorMessage,
  initTemplateResource,
  getTemplateResources,
  compileTemplate,
  getForwardUri,
  isEmpty,
  rightPad,
  leftPad,
  isNullOrUndefined,
  countDaysOfAYear,
  getStartOfDate,
  getEndOfDate,
  countDayBetween,
  isWeekend,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  round,
  roundInt,
  processJwtKey,
  processJwtKeyByDomain,
  processJwtKeyObject,
  TRADEX_DOMAIN,
  container,
  promise,
  handlePromise,
  RetryError,
  asyncWithRetry,
  removeDuplicateObj,
  VCSC_DOMAIN,
  DOMAINS,
  allPromiseDone,
  Mongo,
  setObjKey,
  createJwtConfig,
  getEnvArr,
  getEnvNum,
  getEnvStr,
  getEnvJson,
  getEnvBool,
  override,
  diffMsTime,
  getMsTime,
  convertISO8601StringToDate,
  formatISO8601StringToDate,
  rsaEncrypt,
  rsaDecrypt,
};

export {
  State,
  Resolve,
  Reject,
  PromiseFunction,
  IPromiseJoin
};
