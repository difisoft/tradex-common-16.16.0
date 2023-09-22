import * as moment from 'moment';
import InvalidParameterError from '../errors/InvalidParameterError';
import { logger as Logger } from '../../modules/log';

const MINUTE_DATE_DISPLAY_FORMAT = 'YYYY-MM-DD';
const DATE_DISPLAY_FORMAT = 'YYYYMMDD';
const DATETIME_DISPLAY_FORMAT = 'YYYYMMDDhhmmss';
const TIME_DISPLAY_FORMAT = 'hhmmss';


const isWeekend = (date: Date): boolean => {
  try {
    return (date.getDay() === 6 || date.getDay() === 0); // 6 = Saturday, 0 = Sunday
  } catch (e) {
    Logger.error(`error on check isWeekend: ${date} - error: ${e}`);
    throw new InvalidParameterError();
  }
};

const countDayBetween = (dateFrom: Date, dateTo: Date): number => {
  try {
    const momentFrom = moment(dateFrom);
    const momentTo = moment(dateTo);
    return Math.ceil(momentTo.diff(momentFrom, 'days', true));
  } catch (e) {
    Logger.error(
        `error on countDateBetween from: ${dateFrom} - to: ${dateTo} - error: ${e}`);
    throw new InvalidParameterError();
  }
};


const formatDateToDisplay = (date: Date, format: string = DATE_DISPLAY_FORMAT): string => {
  try {
    if (date == null) {
      return null;
    }

    const obj = moment(date);
    if (obj.isValid()) {
      return moment.utc(date).format(format);
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const convertStringToDate = (data: string, format: string = DATE_DISPLAY_FORMAT): Date => {
  try {
    const obj = moment.utc(data, format);
    if (obj.isValid()) {
      return obj.toDate();
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const convertISO8601StringToDate = (data: string): Date => {
  try {
    const obj = moment(data);
    if (obj.isValid()) {
      return obj.toDate();
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const formatISO8601StringToDate = (data: Date): string=> {
  try {
    return moment(data).toISOString();
  } catch (e) {
    return null;
  }
};


const compareDateOnly = (date1: Date, date2: Date): number => {
  const temp1 = new Date(date1.getTime());
  const temp2 = new Date(date2.getTime());
  temp1.setHours(0, 0, 0, 0);
  temp2.setHours(0, 0, 0, 0);
  return temp1.getTime() - temp2.getTime();
};


const getEndOfDate = (date: Date): Date => {
  const temp: Date = new Date(date.getTime());
  temp.setHours(23, 59, 59, 0);
  return temp;
};


const getStartOfDate = (date: Date): Date => {
  const temp: Date = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  return temp;
};

const getStartOfWeek = (date: Date): Date => {
  const temp: Date = new Date(date.getTime());
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  temp.setDate(diff);
  temp.setHours(0, 0, 0, 0);
  return temp;
};

const getEndOfWeek = (date: Date): Date => {
  const temp: Date = getStartOfWeek(date);
  temp.setDate(temp.getDate() + 6);
  temp.setHours(23, 59, 59, 0);
  return temp;
};

const getStartOfMonth = (date: Date): Date => {
  const temp: Date = new Date(date.getTime());
  temp.setDate(1);
  temp.setHours(0, 0, 0, 0);
  return temp;
};

const getEndOfMonth = (date: Date): Date => {
  const temp: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  temp.setHours(23, 59, 59, 0);
  return temp;
};

const countDaysOfAYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

const isLeapYear = (year: number): boolean => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

export {
  formatDateToDisplay,
  convertStringToDate,
  MINUTE_DATE_DISPLAY_FORMAT,
  DATETIME_DISPLAY_FORMAT,
  DATE_DISPLAY_FORMAT,
  TIME_DISPLAY_FORMAT,
  compareDateOnly,
  getEndOfDate,
  getStartOfDate,
  countDayBetween,
  countDaysOfAYear,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  convertISO8601StringToDate,
  formatISO8601StringToDate,
  isWeekend
}