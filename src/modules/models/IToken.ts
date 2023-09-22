import IConnectionIdentifier from "./IConnectionIdentifier";

export declare interface IUserData {
  username?: string;
  orderKeys?: string;
  identifierNumber?: string;
  branchCode?: string;
  mngDeptCode?: string;
  deptCode?: string;
  agencyNumber?: string;
  accountNumbers?: string[];
  fssTokenId?: string;
  masEquityTokenId?: string;
  masDrTokenId?: string;
  userLevel?: string;
  mfaData?: string;
  id?: number;
}

export default interface IToken {
  domain?: string;
  sessionId?: string;
  userId?: number;
  serviceCode?: string;
  connectionId?: any;
  serviceId?: string;
  serviceName?: string;
  clientId?: number;
  serviceUserId?: number;
  loginMethod?: number;
  refreshTokenId?: number;
  scopeGroupIds?: number[];
  serviceUsername?: string;
  platform?: string;
  osVersion?: string;
  appVersion?: string;
  grantType?: string;
  userData?: IUserData;
}

export interface IAccessTokenExtendData {
  sgIds: number[]; // scopeGroupIds
  conId?: IConnectionIdentifier; // connectionId
  sc?: string; // serviceCode
  su?: string; // serviceUser
  ud?: IUserData; // userData
  pl?: string; // platform: web/mobile
  gt?: string; // grant_type
  osV?: string;
  appV?: string;
  sId?: string; // sessionId for lotte-rest-bridge
}

export interface IAccessToken extends IAccessTokenExtendData {
  dm?: string;
  uId?: number;
  cId: number;
  suId?: number;
  lm: number;
  rId: number;
  rls?: string[];
}
