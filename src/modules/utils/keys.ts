import * as fs from 'fs';
export const TRADEX_DOMAIN = 'tradex';
export const VCSC_DOMAIN = 'vcsc';
export const DOMAINS = {
  TRADEX_DOMAIN,
  VCSC_DOMAIN,
};

export function processJwtKey(conf: any) {
  if (conf.domain === TRADEX_DOMAIN) {
    processJwtKeyByDomain(conf);
    conf.jwt.domains && Object.keys(conf.jwt.domains).forEach((domain: any) => processJwtKeyByDomain(conf, domain));
  } else {
    processJwtKeyByDomain(conf, conf.domain);
  }
  conf.getDefJwt = () => conf.domain === TRADEX_DOMAIN || !conf.domain ? conf.jwt : conf.jwt.domains[conf.domain]
  conf.getJwt = (domain: string = null) => domain ? conf.jwt.domains[domain] : conf.getDefJwt();
}

export function processJwtKeyByDomain(conf: any, domain: string = null) {
  let obj = conf.jwt;
  if (domain) {
    obj = obj.domains[domain];
  }

  if (!obj) {
    return
  }
  processJwtKeyObject(obj);
}


export function processJwtKeyObject(obj: any) {
  if (!obj) {
    return
  }
  if (obj.privateKeyFile) {
    obj.privateKey = fs.readFileSync(obj.privateKeyFile, 'utf8');
  }

  if (obj.publicKeyFile) {
    obj.publicKey = fs.readFileSync(obj.publicKeyFile, 'utf8');
  }
}
