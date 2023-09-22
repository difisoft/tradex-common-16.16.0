export declare function getEnvStr(name: string, defaultValue?: string): string;
export declare function getEnvArr(name: string, defaultValue?: string[]): string[];
export declare function getEnvNum(name: string, defaultValue?: number): number;
export declare function getEnvJson<T>(name: string, defaultValue?: T): T;
export declare function getEnvBool(name: string, defaultValue?: boolean): boolean;
export declare function createJwtConfig(conf: any, domain: string, domains: string[], keyDir: string, serviceName: string, publicKeyFileName?: string, privateKeyFileName?: string): void;
export declare function override(external: object, source: object): void;
