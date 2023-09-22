"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBulkResult = exports.mapAggCursor = exports.forEachAggCursor = exports.forEachAggCursorPromise = exports.reduceAggCursor = exports.groupAggCursor = exports.BulkError = void 0;
const tslib_1 = require("tslib");
class BulkError extends Error {
    constructor(bulkResult) {
        super();
        this.bulkResult = bulkResult;
    }
    getErrors() {
        return this.bulkResult.getWriteErrors();
    }
}
exports.BulkError = BulkError;
function groupAggCursor(cursor, idGenerator, creator, updater, outConditionNewGroup, outConditionSameGroup) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const results = [];
        const accumulator = new Map();
        yield reduceAggCursor(cursor, accumulator, (item) => {
            const id = idGenerator(item);
            if (accumulator.has(id)) {
                if (outConditionSameGroup != null && outConditionSameGroup(results, accumulator, item) === true) {
                    return false;
                }
                updater(item, accumulator.get(id));
            }
            else {
                if (outConditionNewGroup != null && outConditionNewGroup(results, accumulator, item) === true) {
                    return false;
                }
                const f = creator(item);
                accumulator.set(id, f);
                results.push(f);
            }
            return true;
        });
        return results;
    });
}
exports.groupAggCursor = groupAggCursor;
function reduceAggCursor(cursor, accumulator, callback) {
    return new Promise((resolve, reject) => {
        let process;
        const closeReject = (err) => {
            reject(err);
            cursor.close().then().catch();
        };
        process = () => {
            cursor.hasNext().then((has) => {
                if (has) {
                    cursor.next().then((data) => {
                        try {
                            let result;
                            try {
                                result = callback(data, accumulator);
                            }
                            catch (e) {
                                closeReject(e);
                                return;
                            }
                            if (result === false) {
                                cursor.close().then(() => resolve(accumulator)).catch(reject);
                            }
                            else if (result instanceof Promise) {
                                result.then((res) => {
                                    if (res === false) {
                                        cursor.close().then(() => resolve(accumulator)).catch(reject);
                                    }
                                    else {
                                        process();
                                    }
                                }).catch(closeReject);
                            }
                            else {
                                process();
                            }
                        }
                        catch (e) {
                            closeReject(e);
                            return;
                        }
                    }).catch(closeReject);
                }
                else {
                    cursor.close().then(resolve).catch(reject);
                }
            }).catch(closeReject);
        };
        process();
    });
}
exports.reduceAggCursor = reduceAggCursor;
function forEachAggCursorPromise(cursor, callback) {
    return new Promise((resolve, reject) => {
        let process;
        const closeReject = (err) => {
            reject(err);
            cursor.close().then().catch();
        };
        process = () => {
            cursor.hasNext().then((has) => {
                if (has) {
                    cursor.next().then((data) => {
                        try {
                            let result;
                            try {
                                result = callback(data);
                            }
                            catch (e) {
                                closeReject(e);
                                return;
                            }
                            if (result === false) {
                                cursor.close().then(resolve).catch(reject);
                            }
                            else if (result instanceof Promise) {
                                result.then((res) => {
                                    if (res === false) {
                                        cursor.close().then(resolve).catch(reject);
                                    }
                                    else {
                                        process();
                                    }
                                }).catch(closeReject);
                            }
                            else {
                                process();
                            }
                        }
                        catch (e) {
                            closeReject(e);
                            return;
                        }
                    }).catch(closeReject);
                }
                else {
                    cursor.close().then(resolve).catch(reject);
                }
            }).catch(closeReject);
        };
        process();
    });
}
exports.forEachAggCursorPromise = forEachAggCursorPromise;
function forEachAggCursor(cursor, callback) {
    return new Promise((resolve, reject) => {
        let process;
        const closeReject = (err) => {
            reject(err);
            cursor.close().then().catch();
        };
        process = () => {
            cursor.hasNext().then((has) => {
                if (has) {
                    cursor.next().then((data) => {
                        let result;
                        try {
                            result = callback(data);
                        }
                        catch (e) {
                            closeReject(e);
                            return;
                        }
                        if (result === false) {
                            cursor.close().then(resolve).catch(reject);
                        }
                        else {
                            process();
                        }
                    }).catch(closeReject);
                }
                else {
                    cursor.close().then(resolve).catch(reject);
                }
            }).catch(closeReject);
        };
        process();
    });
}
exports.forEachAggCursor = forEachAggCursor;
function mapAggCursor(cursor, transform) {
    return new Promise((resolve, reject) => {
        const results = [];
        let process;
        const closeReject = (err) => {
            reject(err);
            cursor.close().then().catch();
        };
        process = () => {
            cursor.hasNext().then((has) => {
                if (has) {
                    cursor.next().then((data) => {
                        try {
                            results.push(transform(data));
                        }
                        catch (e) {
                            closeReject(e);
                            return;
                        }
                        process();
                    }).catch(closeReject);
                }
                else {
                    cursor.close().then(() => resolve(results)).catch(reject);
                }
            }).catch(closeReject);
        };
        process();
    });
    return new Promise((resolve, reject) => {
        const results = [];
        cursor.each((error, result) => {
            if (error != null) {
                reject(error);
            }
            else {
                try {
                    results.push(transform(result));
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    });
}
exports.mapAggCursor = mapAggCursor;
function handleBulkResult(result) {
    if (result.hasWriteErrors()) {
        throw new BulkError(result);
    }
}
exports.handleBulkResult = handleBulkResult;
//# sourceMappingURL=mongo.js.map