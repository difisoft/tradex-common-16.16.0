import * as AWS from 'aws-sdk';
declare interface IAWSUploadOption {
    expires: number;
    pathToUpload: string;
    minUpload: number;
    maxUpload: number;
    acl: string;
    bucket: string;
    region: string;
    contentType: string;
}
declare const loadCredentials: (conf: any) => void;
declare const getTempCredentials: (conf: any) => Promise<AWS.STS.Credentials>;
declare const generateSignedDataForUpload: (key: string, option: IAWSUploadOption) => Promise<AWS.S3.PresignedPost>;
export { loadCredentials, getTempCredentials, generateSignedDataForUpload, IAWSUploadOption };
