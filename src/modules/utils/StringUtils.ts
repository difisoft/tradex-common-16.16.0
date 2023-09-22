export const isEmpty = (input: string): boolean => {
  return (input == null || input === "" || input.length <= 0);
};

export const leftPad = (str: string, size: number, padString: string): string => {
  if (str == null) {
    return null;
  }
  const pads: number = size - str.length;
  if (pads <= 0) {
    return str;
  }
  const fillData = padString.repeat(pads);
  return `${fillData.slice(0, pads)}${str}`;
};

export const rightPad = (str: string, size: number, padString: string): string => {
  if (str == null) {
    return null;
  }
  const pads: number = size - str.length;
  if (pads <= 0) {
    return str;
  }
  const fillData = padString.repeat(pads);
  return `${str}${fillData.slice(0, pads)}`;
};