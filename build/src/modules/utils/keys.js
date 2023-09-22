"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processJwtKeyObject = exports.processJwtKeyByDomain = exports.processJwtKey = exports.DOMAINS = exports.VCSC_DOMAIN = exports.TRADEX_DOMAIN = void 0;
const fs = require("fs");
exports.TRADEX_DOMAIN = 'tradex';
exports.VCSC_DOMAIN = 'vcsc';
exports.DOMAINS = {
    TRADEX_DOMAIN: exports.TRADEX_DOMAIN,
    VCSC_DOMAIN: exports.VCSC_DOMAIN,
};
function processJwtKey(conf) {
    if (conf.domain === exports.TRADEX_DOMAIN) {
        processJwtKeyByDomain(conf);
        conf.jwt.domains && Object.keys(conf.jwt.domains).forEach((domain) => processJwtKeyByDomain(conf, domain));
    }
    else {
        processJwtKeyByDomain(conf, conf.domain);
    }
    conf.getDefJwt = () => conf.domain === exports.TRADEX_DOMAIN || !conf.domain ? conf.jwt : conf.jwt.domains[conf.domain];
    conf.getJwt = (domain = null) => domain ? conf.jwt.domains[domain] : conf.getDefJwt();
}
exports.processJwtKey = processJwtKey;
function processJwtKeyByDomain(conf, domain = null) {
    let obj = conf.jwt;
    if (domain) {
        obj = obj.domains[domain];
    }
    if (!obj) {
        return;
    }
    processJwtKeyObject(obj);
}
exports.processJwtKeyByDomain = processJwtKeyByDomain;
function processJwtKeyObject(obj) {
    if (!obj) {
        return;
    }
    if (obj.privateKeyFile) {
        obj.privateKey = fs.readFileSync(obj.privateKeyFile, 'utf8');
    }
    if (obj.publicKeyFile) {
        obj.publicKey = fs.readFileSync(obj.publicKeyFile, 'utf8');
    }
}
exports.processJwtKeyObject = processJwtKeyObject;
//# sourceMappingURL=keys.js.map