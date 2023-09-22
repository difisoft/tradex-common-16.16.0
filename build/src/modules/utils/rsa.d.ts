declare const rsaEncrypt: (data: string, publicKey: string) => string;
declare const rsaDecrypt: (data: string, privateKey: string) => string;
export { rsaEncrypt, rsaDecrypt };
