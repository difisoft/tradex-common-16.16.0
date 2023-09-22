export declare const TRADEX_DOMAIN = "tradex";
export declare const VCSC_DOMAIN = "vcsc";
export declare const DOMAINS: {
    TRADEX_DOMAIN: string;
    VCSC_DOMAIN: string;
};
export declare function processJwtKey(conf: any): void;
export declare function processJwtKeyByDomain(conf: any, domain?: string): void;
export declare function processJwtKeyObject(obj: any): void;
