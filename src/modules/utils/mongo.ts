export interface IAggregateCursor<T> {
  hasNext(): Promise<boolean>;

  next(): Promise<T | null>;

  close(): Promise<any | void>;
}

export interface IBulkResult {
  ok: number;
  nInserted: number;
  nUpdated: number;
  nUpserted: number;
  nModified: number;
  nRemoved: number;

  getInsertedIds(): object[];

  getLastOp(): object;

  getRawResponse(): object;

  getUpsertedIdAt(index: number): object;

  getUpsertedIds(): object[];

  getWriteConcernError(): any;

  getWriteErrorAt(index: number): any;

  getWriteErrorCount(): number;

  getWriteErrors(): object[];

  hasWriteErrors(): boolean;
}

export class BulkError extends Error {
  constructor(public bulkResult: IBulkResult) {
    super();
  }

  public getErrors(): object[] {
    return this.bulkResult.getWriteErrors();
  }
}

export async function groupAggCursor<T, F, I>(
  cursor: IAggregateCursor<T> | any,
  idGenerator: (item: T) => I,
  creator: (item: T) => F,
  updater: (item: T, current: F) => void,
  outConditionNewGroup?: (results?: F[], accumulator?: Map<I, F>, item?: T) => boolean,
  outConditionSameGroup?: (results?: F[], accumulator?: Map<I, F>, item?: T) => boolean
): Promise<F[]> {
  const results: F[] = [];
  const accumulator: Map<I, F> = new Map();
  await reduceAggCursor(cursor, accumulator, (item: T) => {
    const id: I = idGenerator(item);
    if (accumulator.has(id)) {
      if (outConditionSameGroup != null && outConditionSameGroup(results, accumulator, item) === true) {
        return false
      }
      updater(item, accumulator.get(id));
    } else {
      if (outConditionNewGroup != null && outConditionNewGroup(results, accumulator, item) === true) {
        return false
      }
      const f: F = creator(item);
      accumulator.set(id, f);
      results.push(f);
    }
    return true;
  });
  return results;
}

export function reduceAggCursor<T, F>(cursor: IAggregateCursor<T> | any, accumulator: F, callback: (item: T, accu?: F) => boolean | void | Promise<any>): Promise<F> {
  return new Promise((resolve: (data: F) => void, reject: (err: Error) => void) => {
    let process: () => void;
    const closeReject = (err: Error) => {
      reject(err);
      cursor.close().then().catch();
    };
    process = () => {
      cursor.hasNext().then((has: boolean) => {
        if (has) {
          cursor.next().then((data: T) => {
            try {
              let result: boolean | void | Promise<any>;
              try {
                result = callback(data, accumulator);
              } catch (e) {
                closeReject(e);
                return;
              }
              if (result === false) {
                cursor.close().then(() => resolve(accumulator)).catch(reject);
              } else if (result instanceof Promise) {
                result.then((res: boolean) => {
                  if (res === false) {
                    cursor.close().then(() => resolve(accumulator)).catch(reject);
                  } else {
                    process();
                  }
                }).catch(closeReject);
              } else {
                process();
              }
            } catch (e) {
              closeReject(e);
              return;
            }
          }).catch(closeReject);
        } else {
          cursor.close().then(resolve).catch(reject);
        }
      }).catch(closeReject);
    };
    process();
  });
}

export function forEachAggCursorPromise<T>(cursor: IAggregateCursor<T> | any, callback: (item: T) => boolean | void | Promise<any>): Promise<any> {
  return new Promise((resolve: (data: T[]) => void, reject: (err: Error) => void) => {
    let process: () => void;
    const closeReject = (err: Error) => {
      reject(err);
      cursor.close().then().catch();
    };
    process = () => {
      cursor.hasNext().then((has: boolean) => {
        if (has) {
          cursor.next().then((data: T) => {
            try {
              let result: boolean | void | Promise<any>;
              try {
                result = callback(data);
              } catch (e) {
                closeReject(e);
                return;
              }
              if (result === false) {
                cursor.close().then(resolve).catch(reject);
              } else if (result instanceof Promise) {
                result.then((res: boolean) => {
                  if (res === false) {
                    cursor.close().then(resolve).catch(reject);
                  } else {
                    process();
                  }
                }).catch(closeReject);
              } else {
                process();
              }
            } catch (e) {
              closeReject(e);
              return;
            }
          }).catch(closeReject);
        } else {
          cursor.close().then(resolve).catch(reject);
        }
      }).catch(closeReject);
    };
    process();
  });
}

export function forEachAggCursor<T>(cursor: IAggregateCursor<T> | any, callback: (item: T) => boolean | void): Promise<any> {
  return new Promise((resolve: (data: T[]) => void, reject: (err: Error) => void) => {
    let process: () => void;
    const closeReject = (err: Error) => {
      reject(err);
      cursor.close().then().catch();
    };
    process = () => {
      cursor.hasNext().then((has: boolean) => {
        if (has) {
          cursor.next().then((data: T) => {
            let result: boolean | void;
            try {
              result = callback(data);
            } catch (e) {
              closeReject(e);
              return;
            }
            if (result === false) {
              cursor.close().then(resolve).catch(reject);
            } else {
              process();
            }
          }).catch(closeReject);
        } else {
          cursor.close().then(resolve).catch(reject);
        }
      }).catch(closeReject);
    };
    process();
  });
}

export function mapAggCursor<T, F>(cursor: IAggregateCursor<T> | any, transform: (item: T) => F): Promise<F[]> {
  return new Promise((resolve: (data: F[]) => void, reject: (err: Error) => void) => {
    const results: F[] = [];
    let process: () => void;
    const closeReject = (err: Error) => {
      reject(err);
      cursor.close().then().catch();
    };
    process = () => {
      cursor.hasNext().then((has: boolean) => {
        if (has) {
          cursor.next().then((data: T) => {
            try {
              results.push(transform(data));
            } catch (e) {
              closeReject(e);
              return;
            }
            process();
          }).catch(closeReject);
        } else {
          cursor.close().then(() => resolve(results)).catch(reject);
        }
      }).catch(closeReject);
    };
    process();
  });


  return new Promise((resolve: (data: F[]) => void, reject: (err: Error) => void) => {
    const results: F[] = [];
    cursor.each((error: Error, result: T) => {
      if (error != null) {
        reject(error);
      } else {
        try {
          results.push(transform(result));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

export function handleBulkResult(result: IBulkResult) {
  if (result.hasWriteErrors()) {
    throw new BulkError(result);
  }
}
