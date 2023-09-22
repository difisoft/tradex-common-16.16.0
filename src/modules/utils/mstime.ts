/**
 * return the differrence between @var time and current time in ms
 * @param time 
 */
export function diffMsTime(time: number): number {
  const currentTime = process.hrtime();
  return currentTime[0] * 1000 + currentTime[1] / 1000000 -time;
}

/**
 * get the time in ms
 * @param hrTime
 */
export function getMsTime(hrTime: number[]=null): number {
  const currentTime = hrTime == null ? process.hrtime() : hrTime;
  return currentTime[0] * 1000 + currentTime[1] / 1000000;
}