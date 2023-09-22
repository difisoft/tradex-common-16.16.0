import { logger as Logger } from '../../modules/log';

export const round = (input: number, scale: number = 2): number => {
  if (input == null) {
    return input;
  } else {
    try {
      return Number(input.toFixed(scale));
    }catch (e) {
      Logger.error(`Error while round data: ${input}`);
      return 0;
    }
  }
};


export const roundInt = (input: number, scale: number = 1): number => {
  if (input == null) {
    return input;
  } else {
    const roundNumber = Math.pow(10, scale);
    return Math.round(input / roundNumber) * roundNumber;
  }
};
