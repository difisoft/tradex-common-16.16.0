export function getEnvStr(name: string, defaultValue: string = ""): string {
  const result: string = process.env[name];
  return (result == null || result === "") ? defaultValue : result;
}

export function getEnvArr(name: string, defaultValue: string[] = []): string[] {
  const result: string = process.env[name];
  return (result == null || result === "") ? defaultValue : result.split(";");
}

export function getEnvNum(name: string, defaultValue: number = 0): number {
  const result: string = process.env[name];
  return (result == null || result === "") ? defaultValue : Number(result);
}

export function getEnvJson<T>(name: string, defaultValue?: T): T {
  const result: string = process.env[name];
  return (result == null || result === "") ? defaultValue : JSON.parse(result);
}

export function getEnvBool(name: string, defaultValue?: boolean): boolean {
  const result: string = process.env[name];
  if (result == null || result === "") {
    return defaultValue;
  }

  if (result.toLowerCase() === 'y' || result.toLowerCase() === 'yes' || result.toLowerCase() === 'true') {
    return true;
  }

  if (result.toLowerCase() === 'n' || result.toLowerCase() === 'no' || result.toLowerCase() === 'false') {
    return false;
  }
  throw Error(`Config env is not a boolean type: ${name}. Result is ${result}`);
}

export function createJwtConfig(conf: any, domain: string, domains: string[], keyDir: string, serviceName: string,
                                publicKeyFileName?: string, privateKeyFileName?: string): void {
  conf.jwt = {};
  const domainConfig = {};
  domains.forEach((dm: string) => {
    const config: any = {};
    domainConfig[dm] = config;
    if (publicKeyFileName != null && publicKeyFileName !== "") {
      config.publicKeyFile = `${keyDir}/${serviceName}/${dm}/${publicKeyFileName}`;
    }
    if (privateKeyFileName != null && privateKeyFileName !== "") {
      config.privateKeyFile = `${keyDir}/${serviceName}/${dm}/${privateKeyFileName}`;
    }
    if (dm === domain) {
      Object.assign(conf.jwt, config);
    }
  });
  conf.jwt.domains = domainConfig;
}

export function override(external: object, source: object) {
  const keys = Object.keys(external);
  keys.forEach((key: string) => {
    const dst: any = external[key];
    const src: any = source[key];
    if (dst == null) {
      source[key] = undefined;
      return;
    }
    if (src == null) {
      source[key] = dst;
      return;
    }
    const typeSrc = typeof src;
    const typeDst = typeof dst;
    if (typeSrc === 'object') {
      if (typeDst !== 'object') {
        source[key] = dst;
        return;
      }
      override(dst, src);
      return;
    }
    source[key] = dst;
  });
}
