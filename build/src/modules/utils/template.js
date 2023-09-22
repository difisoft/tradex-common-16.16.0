"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTemplate = exports.getTemplateResources = exports.init = void 0;
const uuid_1 = require("uuid");
const Handlebars = require("handlebars");
const __1 = require("../..");
const models_1 = require("../models");
const errors_1 = require("../errors");
let templateResources = [];
const init = (msNames, requestTopic = 'configuration', uri = '/api/v1/template') => {
    __1.Kafka.getInstance().sendRequest(uuid_1.v4(), requestTopic, uri, {
        msNames: msNames
    })
        .subscribe((message) => {
        if (message.data.status != null) {
            __1.Logger.error(message.data.status);
        }
        else {
            templateResources = message.data.data;
        }
    });
};
exports.init = init;
const getTemplateResources = () => {
    return templateResources;
};
exports.getTemplateResources = getTemplateResources;
const compileTemplate = (templateUrl, data) => {
    return new Promise((resolve, reject) => {
        fetch(templateUrl)
            .then((response) => {
            if (response.status >= 400) {
                reject(models_1.createFailResponse(errors_1.TEMPLATE_LOAD_FAILED));
            }
            else {
                return response.text();
            }
        })
            .then((text) => {
            const template = Handlebars.compile(text);
            resolve(template(data));
        })
            .catch((err) => {
            reject(models_1.createFailResponse(errors_1.TEMPLATE_LOAD_FAILED));
        });
    });
};
exports.compileTemplate = compileTemplate;
//# sourceMappingURL=template.js.map