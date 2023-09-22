import { IAccessToken, IToken } from "../models";

const generateToken = (length: number = 6, onlyDigit: boolean = true): string => {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (onlyDigit) {
    possible = '0123456789';
  }
  
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

function undefinedOr<T>(data: T): T {
  if (data == null) {
    return undefined;
  }
  return data;
}

function convertToken(token: IAccessToken): IToken {
  if (token == null) {
    return null;
  }

  return {
    userData: undefinedOr(token.ud),
    appVersion: undefinedOr(token.appV),
    clientId: undefinedOr(token.cId),
    domain: undefinedOr(token.dm),
    loginMethod: undefinedOr(token.lm),
    osVersion: undefinedOr(token.osV),
    platform: undefinedOr(token.pl),
    grantType: undefinedOr(token.gt),
    refreshTokenId: undefinedOr(token.rId),
    scopeGroupIds: undefinedOr(token.sgIds),
    serviceCode: undefinedOr(token.sc),
    serviceUserId: undefinedOr(token.suId),
    serviceUsername: undefinedOr(token.su),
    userId: undefinedOr(token.uId),
    connectionId: undefinedOr(token.conId ? token.conId.connectionId : null),
    serviceId: undefinedOr(token.conId ? token.conId.serviceId : null),
    serviceName: undefinedOr(token.conId ? token.conId.serviceName : null),
  };
}

export { generateToken, convertToken, undefinedOr }
