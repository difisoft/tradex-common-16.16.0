"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPromiseDone = exports.asyncWithRetry = exports.RetryError = exports.handlePromise = exports.promise = void 0;
const tslib_1 = require("tslib");
function promise(func) {
    const promise = new Promise((resolve, reject) => {
        func(resolve, reject);
    });
    return promise;
}
exports.promise = promise;
function handlePromise(func, reject, prom) {
    prom.then((data) => {
        func(data);
    }).catch(reject);
}
exports.handlePromise = handlePromise;
class RetryError extends Error {
    constructor(errors, message) {
        super(message);
        this.errors = errors;
    }
}
exports.RetryError = RetryError;
function asyncWithRetry(func, maxRetryTime) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (maxRetryTime <= 0) {
            return func();
        }
        const errors = [];
        for (let i = 0; i <= maxRetryTime; i++) {
            try {
                const result = yield func();
                return result;
            }
            catch (e) {
                errors.push(e);
            }
        }
        throw new RetryError(errors, `fail to retry with ${maxRetryTime} times`);
    });
}
exports.asyncWithRetry = asyncWithRetry;
class PromiseJoinError extends Error {
    constructor(results) {
        super("");
        this.results = results;
    }
}
function allPromiseDone(promises, stopOnError = false, returnError = true) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const data = [];
        promises.forEach(() => data.push({
            state: 0
        }));
        let finishCount = 0;
        let errorCount = 0;
        const handleResult = (resolve, reject, result, index, isError = false) => {
            if (stopOnError && errorCount > 0) {
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
            }
            else {
                data[index].state = 1;
                data[index].result = result;
            }
            finishCount++;
            if (finishCount === data.length) {
                if (returnError) {
                    if (errorCount === 0) {
                        resolve(data);
                    }
                    else {
                        reject(new PromiseJoinError(data));
                    }
                }
                else {
                    resolve(data);
                }
            }
        };
        return new Promise((resolve, reject) => {
            promises.forEach((pro, index) => {
                pro
                    .then((result) => handleResult(resolve, reject, result, index))
                    .catch((err) => handleResult(resolve, reject, err, index, true));
            });
        });
    });
}
exports.allPromiseDone = allPromiseDone;
//# sourceMappingURL=promise.js.map