import {logger as Logger} from '../modules/log';
import { ITestResult } from './CommonTest';

const testResults: ITestResult[] = [];

function finish() {
  let isError: boolean = false;
  Logger.warn('************************************8');
  testResults.forEach((result: ITestResult) => {
    isError = isError && result.success;
    Logger.warn('----------------------------------------------------');
    Logger.warn(`Test '${result.testName}' status '${result.success}' ${result.success ? '' : ` reason '${result.reason}'`}`);
  });
  Logger.warn('************************************8');
  if (isError) {
    setTimeout(() => process.exit(1), 5000);
  } else {
    setTimeout(() => process.exit(0), 5000);
  }
}

export const startTest = (tests: any) => {
  if (process.argv.length > 2) {
    if (process.argv[2] === 'test') { // run acceptance test
      const keys: string[] = Object.keys(tests);
      Logger.info('test keys:', keys);
      if (process.argv[3]) {
        if (tests[process.argv[3]]) {
          Logger.info('running...', process.argv[3]);
          tests[process.argv[3]]().run().subscribe(
            (data: ITestResult) => testResults.push(data),
            (err: Error) => Logger.logError('error', err),
            finish
          );
        }
      } else {
        let run2: (index: number) => void = null;
        const run: (i: number) => void = (i: number) => {
          Logger.info('*************running...', keys[i]);
          tests[keys[i]]().run().subscribe(
            (data: ITestResult) => testResults.push(data),
            (err: Error) => Logger.logError('error', err),
            () => {
              if (i + 1 === keys.length) {
                finish();
              } else {
                run2(i + 1);
              }
            }
          );
        };
        run2 = run;
        run(0);
      }
    }
  }
};


