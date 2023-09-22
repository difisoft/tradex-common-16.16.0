import * as AWS from 'aws-sdk';

declare interface IAWSUploadOption {
  expires: number; //seconds
  pathToUpload: string;
  minUpload: number;
  maxUpload: number;
  acl: string;
  bucket: string;
  region: string;
  contentType: string;
}

const loadCredentials = (conf: any) => {
  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: conf.accessKeyId,
    secretAccessKey: conf.secretAccessKey
  });
}

const getTempCredentials = (conf: any): Promise<AWS.STS.Credentials> => {
  return new Promise<AWS.STS.Credentials>((resolve: Function, reject: Function) => {
    const sts = new AWS.STS();
    sts.assumeRole(conf, (err: AWS.AWSError, data: AWS.STS.AssumeRoleResponse) => {
      if (err == null) {
        const tempCredentials = data.Credentials;

        resolve(tempCredentials);
      } else {
        reject(err);
      }

    });
  });

}

const generateSignedDataForUpload = (key: string, option: IAWSUploadOption): Promise<AWS.S3.PresignedPost> => {
  return new Promise<AWS.S3.PresignedPost>((resolve: Function, reject: Function) => {
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
    }, (err: Error, data: AWS.S3.PresignedPost) => {
      if (err != null) {
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });
}

export { loadCredentials, getTempCredentials, generateSignedDataForUpload, IAWSUploadOption }