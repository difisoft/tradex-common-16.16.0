"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateErrorMessage = exports.getInstance = exports.initByOptions = exports.initInternal = exports.init = exports.getLanguageCode = void 0;
const acceptLanguage = require("accept-language");
const i18n = require("i18next");
const uuid_1 = require("uuid");
const i18next_fetch_backend_1 = require("i18next-fetch-backend");
require("isomorphic-fetch");
const __1 = require("../..");
acceptLanguage.languages(['vi', 'en', 'ko', 'zh']);
const getLanguageCode = (acceptLanguageHeader) => {
    try {
        return acceptLanguage.get(acceptLanguageHeader);
    }
    catch (e) {
        return 'vi';
    }
};
exports.getLanguageCode = getLanguageCode;
const defaultResources = {};
const init = (msNames, namespaceList, requestTopic = 'configuration', uri = '/api/v1/locale') => {
    i18n
        .use(i18next_fetch_backend_1.default);
    __1.Kafka.getInstance().sendRequestAsync(uuid_1.v4(), requestTopic, uri, {
        msNames: msNames
    })
        .then((message) => {
        if (message.data.status != null) {
            __1.Logger.error(message.data.status);
        }
        else {
            const data = message.data.data;
            i18n
                .init({
                fallbackLng: 'en',
                preload: ['en', 'ko', 'vi', 'zh'],
                saveMissing: true,
                backend: {
                    loadPath: (lngs, namespaces) => {
                        if (data != null && Array.isArray(data)) {
                            for (let i = 0; i < data.length; i++) {
                                const element = data[i];
                                if (element.lang === lngs[0] && element.files != null) {
                                    for (let j = 0; j < element.files.length; j++) {
                                        const file = element.files[j];
                                        if (file.namespace === namespaces[0]) {
                                            if (element.lang === 'en') {
                                                defaultResources[namespaces[0]] = file.url;
                                            }
                                            return file.url;
                                        }
                                    }
                                }
                            }
                        }
                        return defaultResources[namespaces[0]];
                    }
                },
                ns: namespaceList,
                defaultNS: namespaceList[0],
                fallbackNS: namespaceList.slice(1)
            });
        }
    }).catch((err) => __1.Logger.error("fail to init i18n", err));
};
exports.init = init;
const initByOptions = (initOption) => {
    i18n.init(initOption);
};
exports.initByOptions = initByOptions;
const initInternal = (msNames, namespaceList, requestTopic = 'configuration', uri = '/api/v1/locale/internal') => {
    __1.Kafka.getInstance().sendRequestAsync(uuid_1.v4(), requestTopic, uri, {
        msNames: msNames
    })
        .then((message) => {
        if (message.data.status != null) {
            __1.Logger.error(message.data.status);
            __1.Utils.initI18nInternal(msNames, namespaceList, requestTopic, uri);
        }
        else {
            const data = message.data.data;
            const resources = {};
            if (data != null && Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    resources[element.lang] = {};
                    if (element.files != null) {
                        for (let j = 0; j < element.files.length; j++) {
                            const file = element.files[j];
                            resources[element.lang][file.namespace] = file.content;
                        }
                    }
                }
            }
            i18n
                .init({
                fallbackLng: 'en',
                preload: ['en', 'ko', 'vi', 'zh'],
                saveMissing: true,
                resources: resources,
                ns: namespaceList,
                defaultNS: namespaceList[0],
                fallbackNS: namespaceList.slice(1)
            });
        }
    }).catch((err) => __1.Logger.error("fail to init i18nInternal", err));
};
exports.initInternal = initInternal;
const getInstance = () => {
    return i18n;
};
exports.getInstance = getInstance;
const translateErrorMessage = (errorObject, lang) => {
    const messageParams = errorObject.messageParams;
    const errorResponse = {
        code: errorObject.code,
        messageParams: messageParams
    };
    const placeholders = {};
    placeholders.lng = lang;
    if (messageParams != null) {
        for (let i = 0; i < messageParams.length; i++) {
            placeholders[i] = i18n.t(messageParams[i], { lng: lang });
        }
    }
    const params = errorObject.params;
    if (params != null && params.length > 0) {
        errorResponse.params = [];
        for (let i = 0; i < params.length; i++) {
            const subCode = params[i].code;
            const subMessageParams = params[i].messageParams;
            const subPlaceholders = {};
            subPlaceholders.lng = lang;
            if (subMessageParams != null) {
                for (let j = 0; j < subMessageParams.length; j++) {
                    subPlaceholders[j] = i18n.t(subMessageParams[j], { lng: lang });
                }
            }
            const subMessage = i18n.t(subCode, subPlaceholders);
            errorResponse.params[i] = {
                code: subCode,
                message: subMessage,
                param: params[i].param
            };
        }
    }
    const message = i18n.t(errorObject.code, placeholders);
    if (message != null) {
        errorResponse.message = message;
    }
    else {
        errorResponse.message = errorResponse.code;
    }
    return errorResponse;
};
exports.translateErrorMessage = translateErrorMessage;
//# sourceMappingURL=locale.js.map