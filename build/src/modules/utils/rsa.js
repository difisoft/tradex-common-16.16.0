"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rsaDecrypt = exports.rsaEncrypt = void 0;
const crypto = require("crypto");
const MULTI_ENCRYPTION_PART_PREFIX = 'mutipart';
const rsaEncrypt = (data, publicKey) => {
    try {
        return rsaEncryptShort(data, publicKey);
    }
    catch (e) {
        if (e.message != null && e.message.indexOf('data too large for key size') >= 0) {
            let encryption = MULTI_ENCRYPTION_PART_PREFIX;
            let index = 0;
            while (index < data.length) {
                const part = data.substr(index, Math.min(100, data.length - index));
                encryption += `.${rsaEncryptShort(part, publicKey)}`;
                index += 100;
            }
            return encryption;
        }
        throw e;
    }
};
exports.rsaEncrypt = rsaEncrypt;
const rsaEncryptShort = (data, publicKey) => {
    const buffer = Buffer.from(data);
    const encrypted = crypto.publicEncrypt({ key: publicKey, padding: 1 }, buffer);
    return encrypted.toString("base64");
};
const rsaDecrypt = (data, privateKey) => {
    if (data.startsWith(`${MULTI_ENCRYPTION_PART_PREFIX}.`)) {
        const parts = data.split(".");
        let result = "";
        for (let i = 1; i < parts.length; i++) {
            result += rsaDecryptShort(parts[i], privateKey);
        }
        return result;
    }
    else {
        return rsaDecryptShort(data, privateKey);
    }
};
exports.rsaDecrypt = rsaDecrypt;
const rsaDecryptShort = (data, privateKey) => {
    const buffer = Buffer.from(data, "base64");
    const decrypted = crypto.privateDecrypt({ key: privateKey, padding: 1 }, buffer);
    return decrypted.toString("utf8");
};
//# sourceMappingURL=rsa.js.map