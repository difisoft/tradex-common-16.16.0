type Resolve<T> = (data: T) => void;
type Reject = (err: Error) => void;
type PromiseFunction<T> = (resolve: Resolve<T>, reject: Reject) => void;

function promise<T>(func: PromiseFunction<T>): Promise<T> {
  const promise: any =  new Promise<T>((resolve: any, reject: any) => { // tslint:disable-line
    func(resolve, reject);
  });
  return promise;
}

function handlePromise<T>(func: (data: T) => void, reject: Reject, prom: Promise<T>) {
  prom.then((data: T) => {
    func(data);
  }).catch(reject);
}

class RetryError extends Error {
  constructor(public errors: Error[], message?: string) {
    super(message);
  }
}

async function asyncWithRetry<T>(func: () => Promise<T>, maxRetryTime: number): Promise<T> {
  if (maxRetryTime <= 0) {
    return func();
  }
  const errors: Error[] = [];
  for (let i = 0; i <= maxRetryTime; i++) {
    try {
      const result: T = await func(); // tslint:disable-line
      return result;
    } catch (e) {
      errors.push(e);
    }
  }
  throw new RetryError(errors, `fail to retry with ${maxRetryTime} times`);
}

interface IPromiseJoin<T> {
  state: 0 | 1 | 2; // not finished, done, error
  result?: T;
  error?: Error;
}

class PromiseJoinError<T> extends Error {
  constructor(public results: IPromiseJoin<T>[]) {
    super("")
  }
}

async function allPromiseDone<T>(promises: Promise<T>[], stopOnError: boolean = false, returnError: boolean = true): Promise<IPromiseJoin<T>[]> {
  const data: IPromiseJoin<T>[] = [];
  promises.forEach(() => data.push({
    state: 0
  }));
  let finishCount: number = 0;
  let errorCount: number = 0;
  const handleResult = (resolve: (data: IPromiseJoin<T>[]) => void, reject: (err: Error) => void, result: any, index: number, isError: boolean = false) => {
    if(stopOnError && errorCount > 0) {
      return;
    }
    if (isError) {
      data[index].state = 2;
      data[index].error = result;
      errorCount++;
      if (stopOnError) {
        reject(result);
        return;
      }
    } else {
      data[index].state = 1;
      data[index].result = result;
    }
    finishCount++;
    if (finishCount === data.length) {
      if (returnError) {
        if (errorCount === 0) {
          resolve(data);
        } else {
          reject(new PromiseJoinError(data));
        }
      } else {
        resolve(data);
      }
    }
  };
  return new Promise((resolve: (data: IPromiseJoin<T>[]) => void, reject: (err: Error) => void) => {
    promises.forEach((pro: Promise<T>, index: number) => {
      pro
        .then((result: T) => handleResult(resolve, reject, result, index))
        .catch((err: Error) => handleResult(resolve, reject, err, index, true));
    });
  });
}

export {
  promise,
  handlePromise,
  Resolve,
  Reject,
  PromiseFunction,
  RetryError,
  asyncWithRetry,
  IPromiseJoin,
  allPromiseDone,
}