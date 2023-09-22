export const isNullOrUndefined = (input: any): boolean => {
  return (input === undefined || input === null) ? true : false;
};

export function setObjKey(obj: { [s: string]: any }, key: string, value: any): { [s: string]: any } {
  const object: { [s: string]: any } = obj;
  if (object == null) {
    return {
      [key]: value
    };
  } else {
    object[key] = value;
  }
  return object;
}