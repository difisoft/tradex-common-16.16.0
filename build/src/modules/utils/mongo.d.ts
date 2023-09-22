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
export declare class BulkError extends Error {
    bulkResult: IBulkResult;
    constructor(bulkResult: IBulkResult);
    getErrors(): object[];
}
export declare function groupAggCursor<T, F, I>(cursor: IAggregateCursor<T> | any, idGenerator: (item: T) => I, creator: (item: T) => F, updater: (item: T, current: F) => void, outConditionNewGroup?: (results?: F[], accumulator?: Map<I, F>, item?: T) => boolean, outConditionSameGroup?: (results?: F[], accumulator?: Map<I, F>, item?: T) => boolean): Promise<F[]>;
export declare function reduceAggCursor<T, F>(cursor: IAggregateCursor<T> | any, accumulator: F, callback: (item: T, accu?: F) => boolean | void | Promise<any>): Promise<F>;
export declare function forEachAggCursorPromise<T>(cursor: IAggregateCursor<T> | any, callback: (item: T) => boolean | void | Promise<any>): Promise<any>;
export declare function forEachAggCursor<T>(cursor: IAggregateCursor<T> | any, callback: (item: T) => boolean | void): Promise<any>;
export declare function mapAggCursor<T, F>(cursor: IAggregateCursor<T> | any, transform: (item: T) => F): Promise<F[]>;
export declare function handleBulkResult(result: IBulkResult): void;
