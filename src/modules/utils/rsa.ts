import * as crypto from "crypto";
​
const MULTI_ENCRYPTION_PART_PREFIX = 'mutipart';
​
const rsaEncrypt = (data: string, publicKey: string) => {
  try {
    return rsaEncryptShort(data, publicKey);
  } catch (e) {
    if (e.message != null && e.message.indexOf('data too large for key size') >= 0) {
      let encryption = MULTI_ENCRYPTION_PART_PREFIX;
      let index = 0;
      while(index < data.length) {
        const part = data.substr(index, Math.min(100, data.length - index));
        encryption += `.${rsaEncryptShort(part, publicKey)}`;
        index += 100;
      }
      return encryption;
    } 
    throw e;
  }
}
​
const rsaEncryptShort = (data: string, publicKey: string) => {  
  const buffer = Buffer.from(data);
  const encrypted = crypto.publicEncrypt({key: publicKey, padding: 1}, buffer);
  return encrypted.toString("base64");
};
​
const rsaDecrypt = (data: string, privateKey: string) => {
  if (data.startsWith(`${MULTI_ENCRYPTION_PART_PREFIX}.`)) {
    const parts = data.split(".");
    let result = "";
    for (let i = 1; i < parts.length; i++) {
      result += rsaDecryptShort(parts[i], privateKey);
    }
    return result;
  } else {
    return rsaDecryptShort(data, privateKey);
  }
}
​
const rsaDecryptShort = (data: string, privateKey: string) => {
  const buffer = Buffer.from(data, "base64");
  const decrypted = crypto.privateDecrypt({key: privateKey, padding: 1}, buffer);
  return decrypted.toString("utf8");
};
​
export {
  rsaEncrypt,
  rsaDecrypt
}