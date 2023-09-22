"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForwardUri = void 0;
const aaa_1 = require("../models/aaa");
function getForwardUriWithSetting(msg, forwardConfig, token, transformUriMap) {
    const result = {};
    const uri = (typeof msg === 'string') ? msg : msg.uri;
    if (forwardConfig.forwardType === aaa_1.ForwardType.CONNECTION) {
        const forwardData = forwardConfig;
        if (forwardData.type.toString() === aaa_1.ForwardDataType.SERVICE_STRING_MAPPING) {
            if (token.serviceName in forwardData.uri_mapping) {
                result.uri = forwardData.uri_mapping[token.serviceName];
            }
        }
        else if (forwardData.type.toString() === aaa_1.ForwardDataType.SERVICE_STRING_MAPPING) {
            if (token.serviceName in forwardData.uri_mapping) {
                result.uri = transformUriMap[forwardData.uri_mapping[token.serviceName]](uri);
            }
        }
        result.conId = {
            connectionId: token.connectionId,
            serviceId: token.serviceId,
            serviceName: token.serviceName,
        };
        const serviceName = token.serviceName;
        const serviceId = token.serviceId;
        result.topic = `${serviceName}.${serviceId}`;
    }
    else if (forwardConfig.forwardType === aaa_1.ForwardType.SERVICE) {
        const forwardData = forwardConfig;
        result.topic = forwardData.service;
        result.uri = forwardData.uri;
    }
    return result;
}
function getForwardUri(msg, matchedScope, token, transformUriMap) {
    return getForwardUriWithSetting(msg, matchedScope.forwardData, token, transformUriMap);
}
exports.getForwardUri = getForwardUri;
//# sourceMappingURL=scope.js.map