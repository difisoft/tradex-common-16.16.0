import { IScope, ICommonForward, ForwardType, IForwardConnection, ForwardDataType, IForwardService } from '../models/aaa';
import { IToken, IForwardUriResult } from '../models';

function getForwardUriWithSetting(msg: IInputUri | string, forwardConfig: ICommonForward, token: IToken, transformUriMap?: any): IForwardUriResult {
  const result: IForwardUriResult = {};
  const uri: string = (typeof msg === 'string') ? msg : msg.uri;
  if (forwardConfig.forwardType === ForwardType.CONNECTION) {
    const forwardData: IForwardConnection = <IForwardConnection>forwardConfig;
    if (forwardData.type.toString() === ForwardDataType.SERVICE_STRING_MAPPING) {
      if (token.serviceName in forwardData.uri_mapping) {
        result.uri = forwardData.uri_mapping[token.serviceName];
      }
    } else if (forwardData.type.toString() === ForwardDataType.SERVICE_STRING_MAPPING) {
      if (token.serviceName in forwardData.uri_mapping) {
        result.uri = transformUriMap[forwardData.uri_mapping[token.serviceName]](uri);
      }
    }
    result.conId = {
      connectionId: token.connectionId,
      serviceId: token.serviceId, 
      serviceName: token.serviceName,
    };
    const serviceName: string = token.serviceName;
    const serviceId: string = token.serviceId;
    result.topic = `${serviceName}.${serviceId}`;
  } else if (forwardConfig.forwardType === ForwardType.SERVICE) {
    const forwardData: IForwardService = <IForwardService>forwardConfig;
    result.topic = forwardData.service;
    result.uri = forwardData.uri;
  }
  return result;
}

export interface IInputUri {
  uri: string;
}

export function getForwardUri(msg: IInputUri | string, matchedScope: IScope, token: IToken, transformUriMap?: any): IForwardUriResult {
  return getForwardUriWithSetting(msg, matchedScope.forwardData, token, transformUriMap);
}