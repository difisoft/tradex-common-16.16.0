"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignedDataForUpload = exports.getTempCredentials = exports.loadCredentials = void 0;
const AWS = require("aws-sdk");
const loadCredentials = (conf) => {
    AWS.config.credentials = new AWS.Credentials({
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey
    });
};
exports.loadCredentials = loadCredentials;
const getTempCredentials = (conf) => {
    return new Promise((resolve, reject) => {
        const sts = new AWS.STS();
        sts.assumeRole(conf, (err, data) => {
            if (err == null) {
                const tempCredentials = data.Credentials;
                resolve(tempCredentials);
            }
            else {
                reject(err);
            }
        });
    });
};
exports.getTempCredentials = getTempCredentials;
const generateSignedDataForUpload = (key, option) => {
    return new Promise((resolve, reject) => {
        const S3 = new AWS.S3({ region: option.region });
        if (option == null) {
            resolve(null);
        }
        S3.createPresignedPost({
            Bucket: option.bucket,
            Fields: {
                key: key,
                acl: option.acl
            },
            Expires: option.expires,
            Conditions: [
                { 'acl': option.acl },
                ['starts-with', '$Content-Type', option.contentType],
                { 'bucket': option.bucket },
                ['starts-with', '$key', option.pathToUpload],
                ['content-length-range', option.minUpload, option.maxUpload]
            ]
        }, (err, data) => {
            if (err != null) {
                resolve(null);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.generateSignedDataForUpload = generateSignedDataForUpload;
//# sourceMappingURL=index.js.map